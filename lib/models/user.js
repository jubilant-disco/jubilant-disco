const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const requiredString = {
    type: String,
    required: true
};

const schema = new Schema({
    name: requiredString,
    email: requiredString,
    hash: requiredString,
    dictionary: [{
        albumId: { type: Array },
        genre: { type: Array },
        artist: { type: Array }
    }],
    favAlbums: [{
        albumId: Number,
        artist: requiredString,
        album: requiredString,
        genre: requiredString,
        rank: {
            type: Number,
            min: 1,
            max: 10
        }
    }],
    favUsers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
});

schema.methods.generateHash = function(password) {
    this.hash = bcrypt.hashSync(password);
};

schema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.hash);
};

schema.static('exists', function(query) {
    return this.find(query)
        .count()
        .then(count => (count > 0));
});

schema.static('getAlbums', function(id) {
    return this.findById(id)
        .lean()
        .select('favAlbums');
});

schema.static('getMyDictionary', function(meId, meFavAlbums) {
    let id = mongoose.Types.ObjectId(meId);
    const favAlbums = meFavAlbums;
    const { genre, artist, albumId } = favAlbums.reduce((acc, album) => {
        acc.genre.push(album.genre);
        acc.artist.push(album.artist);
        acc.albumId.push(album.albumId);
        return acc;
    }, { genre: [], artist: [], albumId: [] });
    return this.aggregate([{
        $match: {
            _id: { $eq: id },
            $or: [
                { 'favAlbums.genre': { $in: genre } },
                { 'favAlbums.artist': { $in: artist } },
                { 'favAlbums.albumId': { $in: albumId } }
            ]
        }
    },
    { $unwind: '$favAlbums' },
    {
        $facet: {
            genre: [{
                $group: {
                    _id: { userId: '$_id', genre: '$favAlbums.genre' },
                    count: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: '$_id.userId',
                    genres: {
                        $push: {
                            k: '$_id.genre',
                            v: '$count'
                        }
                    }
                }
            },
            {
                $project: {
                    genre: { $arrayToObject: '$genres' }
                }
            }
            ],
            artist: [{
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
            }
            ],
            albumId: [{
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
            }
            ]
        }
    }
    ]);
});

schema.static('getDictionaries', function(userId) {
    let id = mongoose.Types.ObjectId(userId);
    return this.getAlbums(userId)
        .then(({ favAlbums }) => {
            const { genre, artist, albumId } = favAlbums.reduce((acc, album) => {
                acc.genre.push(album.genre);
                acc.artist.push(album.artist);
                acc.albumId.push(album.albumId);
                return acc;
            }, { genre: [], artist: [], albumId: [] });
            return this.aggregate([{
                $match: {
                    _id: { $ne: id },
                    $or: [
                        { 'favAlbums.genre': { $in: genre } },
                        { 'favAlbums.artist': { $in: artist } },
                        { 'favAlbums.albumId': { $in: albumId } }
                    ]
                }
            },
            { $unwind: '$favAlbums' },
            {
                $facet: {
                    genre: [{
                        $group: {
                            _id: { userId: '$_id', genre: '$favAlbums.genre' },
                            count: { $sum: 1 }
                        }
                    },
                    {
                        $group: {
                            _id: '$_id.userId',
                            genres: {
                                $push: {
                                    k: '$_id.genre',
                                    v: '$count'
                                }
                            }
                        }
                    },
                    {
                        $project: {
                            genre: { $arrayToObject: '$genres' }
                        }
                    }
                    ],
                    artist: [{
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
                    }
                    ],
                    albumId: [{
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
                    }
                    ]
                }
            }
            ]);
        });
});

schema.static('calculateMatches', function(dictionaries, myId) {
    // console.log('DICTIONARIES', dictionaries[0]);
    return this.findById(myId)
        .select('dictionary')
        .then(myDict =>{
            const myGenreDict = myDict.dictionary[0].genre[0].genre;
            const myArtistDict = myDict.dictionary[0].artist[0].artist;
            const myAlbumIdDict = myDict.dictionary[0].albumId[0].albumId;
            const otherGenreDicts = dictionaries[0].genre;
            console.log('MY GENRE DICT',myGenreDict);
            // console.log('MY ARTIST DICT', myArtistDict);
            // console.log('MY ALBUM DICT', myAlbumIdDict);
            const scores = {};
            for (const [myKey, myValue] of Object.entries(myGenreDict)) {
                for (const {_id, genre} of otherGenreDicts) {
                    scores[_id] = scores[_id] || 0;
                    const otherValue = genre[myKey];
                    if(otherValue) {
                        scores[_id] += Math.min(myValue, otherValue)*2;
                    }
                }
            }
            console.log(scores);
        });
});





module.exports = mongoose.model('User', schema);