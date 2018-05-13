<template>
  <div>
    <h2>1. Choose a sensor network</h2>
    <section class="sec-white">
      <select v-model="network" @change="selectNetwork">
        <option disabled value="">select one of the options</option>
        <option :value="index" :key="index" v-for="(item, index) in networks">
          {{ item }}
        </option>
      </select>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Step11',
  data() {
    return {
      networks: [
        'Airalab CPS [reputation: very good, more then 100 executed smart contracts]',
        'NoName CPS [reputation: undefined, less then 10 executed smart contracts]',
      ],
      network: 0,
    };
  },
  methods: {
    selectNetwork() {
      this.$parent.$emit('network', this.network);
    },
  },
};
</script>
