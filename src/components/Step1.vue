<template>
  <div>
    <div class="secw-narrow">
      <Step11 />
      <Step12 />
      <Step13 v-if="showApprove" :locations="locations" />
    </div>
    <Step14 v-if="showApprove" />
  </div>
</template>

<script>
import Step11 from './Step11';
import Step12 from './Step12';
import Step13 from './Step13';
import Step14 from './Step14';
import { SENSORS } from '../config';

export default {
  name: 'Step1',
  components: {
    Step11,
    Step12,
    Step13,
    Step14,
  },
  beforeCreate() {
    document.body.className = 'step-2';
    const element = document.createElement('div');
    element.innerHTML = '<img id="img-lighthouse" class="lighthouse" alt="" src="static/assets/i/step-2-back.png" srcset="static/assets/i/step-2-back@2x.png">';
    document.body.appendChild(element);
  },
  data() {
    return {
      locations: SENSORS,
      showApprove: false,
    };
  },
  mounted() {
    this.$on('network', (data) => {
      this.locations = (data === 0) ? SENSORS : [];
    });
    this.$on('approve', (data) => {
      this.showApprove = data;
    });
  },
};
</script>
