<template>
  <div class="flex h-dvh flex-col justify-center items-center">
    <div class="card bg-gray-50 container h-[90dvh] shadow-xl px-6 py-9 rounded-lg">
      <div class="flex items-center justify-between gap-6 p-2">
        <h1 class="text-left text-5xl font-bold">Results</h1>
        <input v-model="searchQuery" type="text" placeholder="Search Name" class="w-full p-3 h-full border rounded" />
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
            <th scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
              View Summary
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="item in filteredResults" :key="item._id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ item.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.sections }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.score }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ new
              Date(item.createdAt).toLocaleDateString() }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500  ">
              <button @click="viewSummary(item.questions)" class="text-blue-500 hover:underline cursor-pointer">View
                Summary</button>
            </td>
          </tr>
 
        </tbody>
     
      </table>
      <p v-if="quizStore.results.length === 0 " class=" py-3 text-center w-full">No records found</p>
    </div>

    <div v-if="showSummaryModal" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div class="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full">
        <h2 class="text-xl font-bold mb-4">Summary</h2>
        <div class="max-h-96 overflow-y-auto">
          <ul class="list-disc pl-5">
            <li v-for="(question, index) in summaryQuestions" :key="index">
              <p class="font-semibold">{{ question.text }}</p>
              <p>Correct Answer: {{ question.correctAnswer }}</p>
              <p>User Answer: {{ question.userAnswer }}</p>
            </li>
          </ul>
        </div>
        <button @click="closeSummaryModal"
          class="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useQuizStore } from '@/stores/quiz';

const quizStore = useQuizStore();
const searchQuery = ref('');
const showSummaryModal = ref(false);
const summaryQuestions = ref([]);

const filteredResults = computed(() => {
  return quizStore.results.filter(item => item.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

const viewSummary = (questions) => {
  summaryQuestions.value = questions;
  showSummaryModal.value = true;
};

const closeSummaryModal = () => {
  showSummaryModal.value = false;
};

onMounted(() => {
  quizStore.fetchResults();
});
</script>