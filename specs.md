# Matches points #
Album - 3 points
Artist - 2 points
Genre - 1 point


# TBD #


## Stretch goals ##
- Updating albums arrays
- Related artists to find matches
- User can edit info/albums


# Models #

## User ##
```
{
    name: String,
    desertIslandDiscs: [
        album: { ObjectId limited to 10},
        ranking: { preference}
    ],
    matches: [
        { ObjectId - 5 usematch }
    ]
}

Match subSchema

{
    userId (whose matches are these),
    score: [
        pointsPerAlbum: {
            title: 0 || 3,
            artist: 0 || 2,
            genre: 0 || 1
        }
        pointsPerRanking: {ranking points of other person's album}
    ],
    totalPoints: { Number }
}
```

## Album ##
```
{
    title: String,
    artist String,
    genre: String
}
```

Search for albums

Utilize album ids for album data

Most popular matches/most matched

Which users have the strongest match

Give users option to see match's top ten list

User starts in the interface then what?