<template>
    <div class="grid grid-cols-2 gap-12 m-4 mt-0">
        <div
            class="profile-options-box p-4 border-t-2 border-solid border-gray-100"
        >
            <div class="flex flex-row items-center">
                <h3 class="text-3xl mb-1 col-start-1">{{ listName }}</h3>
                <transition
                    enter-active-class="transition ease-out duration-500 transform"
                    enter-class="opacity-0 scale-100 -translate-y-6"
                    enter-to-class="opacity-100 scale-100"
                    leave-active-class="transition ease-out duration-1500 transform"
                    leave-class="opacity-0 scale-100"
                    leave-to-class="opacity-0 scale-100 -translate-y-3"
                    move="transform ease-in-out duration-500"
                >
                    <div
                        v-if="changes"
                        class="text-center main-button ml-auto text-white px-3 py-1 rounded-md shadow-md transition w-24 col-end-6"
                    >
                        <button @click="saveChanges()">Save</button>
                    </div>
                </transition>
            </div>
            <div class="flex ml-auto  justify-between items-baseline">
                <input
                    type="text"
                    v-model="Url"
                    class="mb-4 mt-2 border-b-2 outline-none min-w-min text-xl"
                    placeholder="Enter url of site"
                />
                <button @click="addToList" class="main-button">
                    Add
                </button>
            </div>
            <div
                class="flex justify-center"
                v-if="this.initialList.length === 0"
            >
                <div class="text-center text-2xl w-2/3">
                    There are no sites currently in your {{ listName }},
                    {{ message }}
                </div>
            </div>
            <div v-else class="w-full">
                <div
                    class="flex flex-row flex-1"
                    v-for="b in initialList"
                    :key="b"
                >
                    <p
                        class="text-gray-700 text-xl m-1.5 hover:text-gray-400 border-gray-200 border-b-2 cursor-pointer"
                    >
                        {{ b }}
                    </p>
                    <div class="flex ml-auto items-center">
                        <!-- <button class="main-button">Link</button> -->
                        <button @click="removeFromList(b)" class="main-button">
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { objectify } from "../utils/object.utils";
import { isEqual } from "lodash";

export default {
    name: "SitesList",
    props: ["list", "listName", "message"],
    data() {
        return {
            Url: "",
            initialList: []
        };
    },
    created() {
        this.initialList = this.list;
    },
    computed: {
        changes: function() {
            return !isEqual(objectify(this.list), objectify(this.initialList));
        }
    },
    methods: {
        addToList: function() {
            this.initialList = [this.Url, ...this.initialList];
            this.Url = "";
        },
        removeFromList: function(website) {
            this.initialList = this.initialList.filter(w => w !== website);
        }
    }
};
</script>
