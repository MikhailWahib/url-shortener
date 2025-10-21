<template>
    <div class="wrapper">
        <div class="list-header">
            <h3>Your Recent URLs</h3>
            <p class="url-count">{{ urls.length }} links</p>
        </div>
        <div class="list-container">
            <p v-if="urls.length === 0" class="no-urls">No URLs shortened yet. Try creating one!</p>
            <ul v-else>
                <li v-for="url in urls" :key="url.id">
                    <div class="url-info">
                        <div class="short-url">
                            <a :href="url.shortUrl" target="_blank">{{ url.shortUrl }}</a>
                            <button @click="handleCopy(url.shortUrl)" class="copy-btn" title="Copy to clipboard">
                                <CopyIcon :size="16" />
                            </button>
                        </div>
                        <p class="original-url">{{ url.originalUrl.slice(8) }}</p>
                    </div>
                    <div class="stats">
                        <div class="clicks">
                            <EyeIcon :size="16" />
                            <p>{{ url.clicks }} views</p>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
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
    animation: slideUp 0.6s ease-out 0.4s backwards;
}

.list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: white;
}

.url-count {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.7);
    background: rgba(255, 255, 255, 0.1);
    padding: 0.375rem 0.75rem;
    border-radius: 20px;
}

.list-container {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

ul {
    display: flex;
    flex-direction: column;
    max-height: 400px;
    overflow-y: auto;
}

li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #e2e8f0;
    transition: background-color 0.2s ease;
}

li:last-child {
    border-bottom: none;
}

li:hover {
    background-color: #f7fafc;
}

.url-info {
    flex: 1;
    min-width: 0;
}

.short-url {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.25rem;
}

.short-url a {
    color: #667eea;
    font-weight: 600;
    text-decoration: none;
    transition: color 0.2s ease;
}

.short-url a:hover {
    color: #5a67d8;
    text-decoration: underline;
}

.copy-btn {
    padding: 0.25rem;
    color: #a0aec0;
    border-radius: 6px;
    transition: all 0.2s ease;
}

.copy-btn:hover {
    color: #667eea;
    background-color: #ebf4ff;
}

.original-url {
    font-size: 0.875rem;
    color: #718096;
    max-width: 400px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.stats {
    margin-left: 2rem;
}

.clicks {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.375rem 0.75rem;
    background: #f7fafc;
    border-radius: 20px;
    color: #4a5568;
}

.clicks svg {
    color: #667eea;
}

.clicks p {
    font-size: 0.875rem;
    font-weight: 500;
}

.no-urls {
    text-align: center;
    padding: 3rem 2rem;
    color: #a0aec0;
    font-size: 1rem;
    font-weight: 500;
}

::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    background: rgba(226, 232, 240, 0.5);
}

::-webkit-scrollbar-thumb {
    background: rgba(160, 174, 192, 0.5);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: rgba(160, 174, 192, 0.7);
}

@media (max-width: 768px) {
    .list-header {
        margin-bottom: 0.75rem;
    }

    h3 {
        font-size: 1.125rem;
    }

    li {
        padding: 0.875rem 1rem;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }

    .original-url {
        max-width: 100%;
    }

    .stats {
        margin-left: 0;
        width: 100%;
    }

    .clicks {
        width: fit-content;
    }
}
</style>