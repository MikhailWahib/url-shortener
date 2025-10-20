<template>
    <div class="wrapper">
        <h2>Recent URLs:</h2>
        <p v-if="urls.length === 0" class="no-urls">No Recent URLS</p>
        <ul>
            <li v-for="url in urls" :key="url.id">
                <a :href="url.shortUrl" target="_blank">{{ url.shortUrl }}</a>
                <p>{{ url.originalUrl.slice(8) }}</p>
                <div class="icons-wrapper">
                    <button @click="handleCopy(url.shortUrl)">
                        <CopyIcon :size="18" />
                    </button>
                    <div class="clicks">
                        <EyeIcon />
                        <p>{{ url.clicks }}</p>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">

import CopyIcon from './icons/CopyIcon.vue';
import EyeIcon from './icons/EyeIcon.vue';
import type { UrlObj } from '@/types';


defineProps({
    urls: {
        type: Array<UrlObj>,
        default: [],
        required: true
    }
})

const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url)
}
</script>


<style scoped>
.wrapper {
    width: 100%;
    margin-top: 2rem;
}

h2 {
    margin-bottom: 1rem;
    font-size: 1.25rem;
    font-weight: 500;
}

ul {
    display: flex;
    flex-direction: column;
    max-height: 300px;
    overflow-y: scroll;
    gap: .5rem;
    padding-right: 5px;
    border-radius: 10px;
}

li {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: .5rem;
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 0.1);
    font-size: 1rem;
}

li>p {
    font-size: .75rem;
    color: rgba(255, 255, 255, 0.5);
    margin-left: 2rem;
    width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
}

a:hover {
    text-decoration: underline;
}

button:hover {
    color: rgba(255, 255, 255, 0.5);
}

.icons-wrapper {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-left: auto;
}

.clicks {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.clicks p {
    font-size: .75rem;
}

.no-urls {
    font-weight: 200;
    opacity: .75;
    /* font-style: italic; */
}

::-webkit-scrollbar {
    width: 7px;
}

::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
}
</style>