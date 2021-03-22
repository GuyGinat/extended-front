<template>
    <div>
        <div class="records-title">
            <div class="text-5xl pb-3">Latest History</div>
        </div>

        <div class="records-container">
            <div v-for="record in records" :key="record._id">
                <div class="record-card">
                    <div class="col-1"></div>
                    <div class="col-7 flex flex-col justify-between pb-3">
                        <div class="text-xl">{{ record.title }}</div>
                        <div>{{ record.dateVisited | moment }}</div>
                        <!-- <p>{{ record.rawText }}</p> -->
                    </div>
                    <div class="col-2 record-time">
                        <!-- <h6>{{ record.dateVisited | moment }}</h6> -->
                    </div>
                    <div class="col-1 record-links">
                        <button class="main-button">Link</button>
                        <button class="main-button">Remove</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import moment from "moment";
import ApiService from "../services/api.service";

export default {
    name: "HomeSignedIn",
    props: {},
    data() {
        return {
            records: [
                // TEMPLATE FOR TESTING
                // {
                //     _id: 1,
                //     title: "example title",
                //     rawText:
                //         "This is some written raw text of some history record...",
                //     dateVisited: 1606582064215,
                //     link: "https://github.com/sahat/hackathon-starter"
                // }
            ]
        };
    },
    filters: {
        moment: function(date) {
            return moment(date).format("MM/DD/YY, h:mm");
        }
    },
    created() {
        ApiService.get("history", "latest")
            .then(res => {
                console.log(res.data)
                let data = res.data.map(r => {
                    return {
                        ...r._source,                        
                        rawText: r._source.rawText.slice(0, 60) + "...",
                        _id: r._id
                    };
                });
                this.records = data;
            })
            .catch(err => {
                console.log(err);
            });
    }
};
</script>

<style>
.records-title {
    margin-top: 6rem;
}

.records-container {
    margin-bottom: 1rem;
}

.record-card {
    padding-top: 1rem;
    display: flex;
    background-color: rgb(250, 250, 250);
    box-shadow: 0px 2px 2px rgba(47, 47, 47, 0.25);
    border-radius: 1px;
    margin-bottom: 1rem;
    /* flex-direction: column; */
}
.record-time {
    align-self: flex-end;
    padding-bottom: 1rem;
}

.record-links {
    align-self: center;
    padding-bottom: 1rem;
}

.main-button {
    margin: .3rem;
    background: conic-gradient(
        from -3.29deg at 100% -13%,
        #ff6348 -8.32deg,
        #ff02e6 11.63deg,
        #ff6348 351.68deg,
        #ff02e6 371.63deg
    );
    border-color: transparent;
    color: white;
    width: 6rem;
    box-shadow: 0px 0px 5px rgba(255, 127, 80, 0.5);
    border-radius: 5px;
}
.main-button:hover {
    background: conic-gradient(
        from -3.29deg at 100% -13%,
        #fd9380 -8.32deg,
        #fd37e9 11.63deg,
        #fa846f 351.68deg,
        #f830e4 371.63deg
    );
}

</style>
