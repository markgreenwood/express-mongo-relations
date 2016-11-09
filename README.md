# Pro cycling riders and teams database

## Description

This database keeps track of professional cyclists and their associated teams.
Each cyclist's name and nationality are tracked, along with (optionally) their
height, weight, and role on the team. The teams are tracked along with their
sponsor name and country in which they're based.

From the database, one can get a list of riders containing the team they're on,
a list of all teams, and info for a particular team including the list of riders on the
team.

The administrator may also add new teams and new riders, update information on a current
rider or team, and establish that an existing rider has joined an existing team.

## Motivation

This was written as a lab assignment for Code Fellows 401 class.

## API Reference

### Users

A new user can be created using the /api/auth/register path. Provide a user object as follows:
```
{
  username: "jane"
  password: "abcd"
  roles: [ 'admin', 'superuser' ]
}
```
where roles are empty, or one or both of "admin" and "superuser". Any user can perform GET 
operations. POST and PUT operations require an "admin", and DELETE operations require "superuser".

The /api/auth/signin path (with a `{ username: <username>, password: <password> }` object) returns a token
if the user authenticates.

There is also a /api/auth/validate path to validate a user's token.

Once a valid token is obtained, it should be passed in PUT, POST, or DELETE headers as:
```
{
  'Authorization', 'Bearer <token>'
}
```

### GET operations

```
GET /api/riders
GET /api/riders?role=sprinter
GET /api/riders?nationality=US
```

Get a list of all riders in the database (including team name if available).
The operation is queryable (to filter by, e.g., role or nationality).

```
GET /api/teams
```

Get a list of all teams in the database.

```
GET /api/riders/<rider_id>
```

Get info for a specific rider (including team if available).

```
GET /api/teams/<team_id>
```

Get info for a specific team (including a list of riders on the team).

```
GET /api/riders/avgHeight
GET /api/riders/avgHeight?role=climber
GET /api/riders/avgWeight
```

These specialized operations returns the average height and weight of the riders in the
database. It is queryable, for example, by role.

### POST operations

```
POST /api/riders
{
  name: 'Jurgen Spengler',
  nationality: 'Luxembourger',
  height: 180,
  weight: 70,
  role: 'sprinter'
}
```

POSTs a new rider to the database.

```
POST /api/teams
{
  team: 'Team CodeFellows',
  sponsor: 'Code Fellows LLC',
  country: 'US'
}
```

POSTs a new team to the database.

```
PUT /api/riders/<rider_id>
{
  weight: 80
}
```

Update a rider's data (somebody gained weight in the off-season...)

```
PUT /api/teams/<team_id>
{
  sponsor: 'REI'
}
```

Update a team's data.

```
PUT /api/teams/<team_id>/rider/<rider_id>
```

Assigns a rider to a team (contract renegotiation?)

```
DELETE /api/riders/<rider_id>
DELETE /api/teams/<team_id>
```

Removes a particular rider or team from the database.

## Tests

The accompanying test suite can be run using the 'npm test' command.

## Contributors

[Mark Greenwood](https://github.com/markgreenwood)

## License

The MIT License (MIT)
Copyright (c) 2016 Mark Greenwood

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
