<template>
<div class='container'>
    <div v-on:click='get' class='jumbotron'>
        <h1>Player Info</h1>
    </div>
    <div class='row'>
        <div class='col-lg-12'>
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
        </div>
    </div>
</div>
</template>

<script>
export default {name: 'app',
    data () {
        return {
            data: false
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
        //this.$http.get('/api/player/' + this.$route.params.id).then(function(res) {
            //this.data = res.body.data;
            //console.log(this.data);
        //});
    },
    methods: {
        get() {
        }
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
