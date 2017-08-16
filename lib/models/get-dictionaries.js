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

const genreFacet = [{
    $group: {
        _id: { userId: '$_id', genre: '$favAlbums.genre' },
        count: { $sum: 1 }
    }
}, {
    $group: {
        _id: '$_id.userId',
        genres: {
            $push: {
                k: '$_id.genre',
                v: '$count'
            }
        }
    }
}, {
    $project: {
        genre: { $arrayToObject: '$genres' }
    }
}];

const artistFacet = [{
    $group: {
        _id: { userId: '$_id', artist: '$favAlbums.artist' },
        rank: { $min: '$favAlbums.rank' }
    }
},
{
    $group: {
        _id: '$_id.userId',
        artists: {
            $push: {
                k: '$_id.artist',
                v: '$rank'
            }
        }
    }
},
{
    $project: {
        artist: { $arrayToObject: '$artists' }
    }
}];

const albumFacet =  [{
    $group: {
        _id: { userId: '$_id', albumId: '$favAlbums.albumId' },
        rank: { $min: '$favAlbums.rank' }
    }
},
{
    $group: {
        _id: '$_id.userId',
        albumIds: {
            $push: {
                k: { $toLower: '$_id.albumId' },
                v: '$rank'
            }
        }
    }
},
{
    $project: {
        albumId: { $arrayToObject: '$albumIds' }
    }
}];

module.exports = function getDictionaries(queryVar, favAlbums) {
    const stats = favAlbums.reduce((acc, album) => {
        acc.genre.push(album.genre);
        acc.artist.push(album.artist);
        acc.albumId.push(album.albumId);
        return acc;
    }, { genre: [], artist: [], albumId: [] });


    return User.aggregate([
        matchUsers(queryVar, stats),
        unwindAlbums,
        {
            $facet: {
                genre: genreFacet,
                artist: artistFacet,
                albumId: albumFacet
            }
        }
    ]);
};