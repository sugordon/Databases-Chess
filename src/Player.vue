<template>
<div class='container'>
    <div class='jumbotron'>
        <h2>Player Info</h2>
    </div>
    <div class='row'>
        <div class='col-lg-6'>
            <table class='info-table table'>
                <tr>
                    <th>Name</th>
                    <td>{{data.Name}}</td>
                </tr>
                <tr>
                    <th>ELO</th>
                    <td>{{data.ELO}}</td>
                </tr>
                <tr>
                    <th>Nationality</th>
                    <td>{{data.Nationality}}</td>
                </tr>
                <tr>
                    <th>Sex</th>
                    <td>{{data.Sex}}</td>
                </tr>
                <tr>
                    <th>Birth Year</th>
                    <td>{{data.Birth_year}}</td>
                </tr>
            </table>
        </div>
        <div v-if='gamedata' class='col-lg-6'>
            <table class='table'>
                <thead>
                    <tr>
                        <th v-on:click='sort("game_id")'>Game Id</th>
                        <th v-on:click='sort("white_player_name")'>White Player</th>
                        <th v-on:click='sort("black_player_name")'>Black Player</th>
                        <th v-on:click='sort("result")'>Result</th>
                        <th v-on:click='sort("event")'>Event</th>
                        <th v-on:click='sort("date")'>Date</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="row in gamedata">
                        <td><a v-bind:href='"#/pgn/"+row.game_id'>{{row.game_id}}</a></td>
                        <td><a v-bind:href='"#/player/"+row.white_player_id'>{{row.white_player_name}}</a></td>
                        <td><a v-bind:href='"#/player/"+row.black_player_id'>{{row.black_player_name}}</a></td>
                        <td style='cursor: pointer'>{{row.result}}</td>
                        <td style='cursor: pointer'>{{row.event}}</td>
                        <td style='cursor: pointer'>{{row.date}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>
</template>

<script>
export default {name: 'app',
    data () {
        return {
            data: false,
            gamedata: false
        }
    },
    created () {
        this.data = {
            Name: 'Smith',
            ELO: 1231,
            Nationality: 'NAT',
            Birth_year: '1900',
            Sex: 'M'
        };
        this.$http.get('/api/playersearch/', {
            params: {
                "type" : "2",
                "game_id" : "",
                "event" : "",
                "player1" : "",
                "player2" : "",
                "pid1" : this.$route.params.id,
                "pid2" : "",
                "date_lower" : "",
                "date_upper" : "",
                "eco" : "",
                "position" : ""
            }
        }).then(function(res) {
            console.log(res.body.data);
            this.gamedata = res.body.data;
        });
    }
}
</script>

<style>
.info-table {
    width: auto;
}
td {
    padding: 0px 100px;
}
th {
    padding: 0px 10px;
}
</style>
