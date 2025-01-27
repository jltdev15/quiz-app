<template>
  <div class="flex h-dvh flex-col justify-center items-center">
    <div class="card bg-gray-50 container h-[90dvh] shadow-xl px-6 py-9 rounded-lg ">
      <div class="">
        <h1 class=" text-left text-5xl font-bold ">Results</h1>
      </div>
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Section
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Score
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="item in quizStore.results" :key="item.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ item.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.sections }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.score }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ new
              Date(item.createdAt).toLocaleDateString() }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';
import { useQuizStore } from '@/stores/quiz';

const quizStore = useQuizStore();
const router = useRouter();

onMounted(() => {
  quizStore.fetchResults();
});
</script>