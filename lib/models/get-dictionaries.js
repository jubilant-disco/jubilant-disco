// cyclical dependency could be an issue
const User = require('./user');

const matchUsers = (queryVar, { genre, artist, albumId }) => {
    return {
        $match: {
            _id: queryVar,
            $or: [
                { 'favAlbums.genre': { $in: genre } },
                { 'favAlbums.artist': { $in: artist } },
                { 'favAlbums.albumId': { $in: albumId } }
            ]
        }
    };
};

const unwindAlbums = { $unwind: '$favAlbums' };

const groupByType = (type, field, operation) => ({
    $group: {
        _id: { 
            userId: '$_id', 
            [type]: `$favAlbums.${type}` 
        },
        [field]: operation
    }
});

const groupByUser = (type, operator) => ({
    $group: {
        _id: '$_id.userId',
        [`${type}s`]: {
            $push: {
                k: `$_id.${type}`,
                v: `$${operator}`
            }
        }
    }
});

const projectFacet = type => ({
    $project: {
        [type]: { $arrayToObject: `$${type}s` }
    }
});

const makeFacet = (type, field, operator) => ([
    groupByType(type, field, operator), 
    groupByUser(type, field), 
    projectFacet(type)
]);

const facets = {
    $facet: {
        genre: makeFacet('genre', 'count', { $sum: 1 }),
        artist: makeFacet('artist', 'rank', { $min: '$favAlbums.rank' }),
        albumId: makeFacet('albumId', 'rank', { $min: '$favAlbums.rank' })
    }
};

const getStats = favAlbums => favAlbums.reduce((acc, album) => {
    acc.genre.push(album.genre);
    acc.artist.push(album.artist);
    acc.albumId.push(album.albumId);
    return acc;
}, { genre: [], artist: [], albumId: [] });

module.exports = function getDictionaries(queryVar, favAlbums) {
    return User.aggregate([
        matchUsers(queryVar, getStats(favAlbums)),
        unwindAlbums,
        facets
    ]);
};