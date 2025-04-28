<template>
  <div class="flex h-dvh flex-col justify-center items-center px-4">
    <div class="card bg-gray-50 w-full max-w-[32rem] shadow-xl px-4 sm:px-6 py-6 sm:py-9 rounded-lg">
      <div class="card-body text-gray-900 p-2 sm:p-4">
        <h1 class="text-3xl sm:text-5xl font-bold text-center">Online Quiz</h1>
      </div>
      <p class="text-sm sm:text-base px-2">Please provide the necessary information before starting taking the quiz.</p>
      <div class="text mt-3">
        <div>
          <label for="first-name" class="block text-sm sm:text-base/6 font-semibold text-gray-900">Full Name</label>
          <div class="mt-1">
            <input v-model="quizStore.name" type="text" placeholder="Surname , First Name" name="first-name"
              id="first-name" autocomplete="given-name"
              class="block w-full rounded-md bg-white px-3.5 py-2 text-sm sm:text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600">
          </div>
          <label for="section" class="block text-sm sm:text-base/6 font-semibold text-gray-900 mt-3">Section</label>
          <div class="mt-1">
            <div class="block w-full">
              <select id="countries" @change="handleSectionChange"
                class="h-10 sm:h-12 border border-gray-300 text-gray-600 text-sm sm:text-base rounded-lg block w-full py-2 px-3 sm:py-2.5 sm:px-4 focus:outline-none">
                <option selected>Choose a section</option>
                <option value="BE2MA">BE2MA</option>
                <option value="BE4AA">BE4AA</option>
                <option value="GC2MA">GC2MA</option>
                <option value="GC4AA">GC4AA</option>
              </select>
            </div>
          </div>
        </div>
        <div class="mt-6 sm:mt-10">
          <button type="button" @click="routeHandlder"
            class="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm sm:text-base font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Start
            the Quiz</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { useQuizStore } from '@/stores/quiz';
const quizStore = useQuizStore();
const router = useRouter()
const handleSectionChange = (event) => {
  quizStore.section = event.target.value;
};

const routeHandlder = () => {
  if (quizStore.name === '' || quizStore.section === '') {
    return alert('Please provide your full name and section before starting the quiz.');
  }
  if (quizStore.section === 'BE2MA' || quizStore.section === 'BE4AA') {
    return router.push({ name: 'college-quiz' })
  }
}


</script>
