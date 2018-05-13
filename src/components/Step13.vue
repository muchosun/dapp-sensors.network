<template>
  <div>
    <h2>3. TRY LIGHTHOUSE</h2>
    <section class="sec-white">
      <h3>Select locations</h3>
      <div class="cols-text-3" v-if="locations.length > 0">
        <div v-for="(item, index) in locations" :key="index">
          <input class="d-ib" :id="item" :value="item"
            v-model="selectedSensors"
            :disabled="index >= 3"
            type="checkbox">
          <label class="d-ib m-l-5" :for="item">{{item}}</label>
        </div>
      </div>
      <button v-on:click="sendMsgAsk" v-if="locations.length > 0" style="margin-top:10px">
        send transaction to CPS with parameters
      </button>
    </section>
  </div>
</template>

<script>
import Promise from 'bluebird';
import findKey from 'lodash/findKey';
import xor from 'lodash/xor';
import robonomics, { getChanel } from '../utils/robonomics';
import { LIGHTHOUSE_SENSOR, HASHES } from '../config';

const signer = (account, hash) => Promise.promisify(web3.eth.sign)(account, hash);
const message = robonomics.message(signer);

const ask = message.create({
  model: 'QmfCcLKrTCuXsf6bHbVupVv4zsbs6kjqTQ7DRftGqMLjdW',
  objective: 'Qmbdan31EbgETmJU79shwQDHcMgNoRS6RMGDNJZNp8FLCS',
  token: robonomics.address.xrt,
  cost: 1,
  count: 1,
  validator: '0x0000000000000000000000000000000000000000',
  validatorFee: 0,
  deadline: 45646546,
});

let chanel;

export default {
  name: 'Step13',
  props: ['locations'],
  data() {
    return {
      lighthouseSensor: LIGHTHOUSE_SENSOR,
      selectedSensors: [],
    };
  },
  created() {
    chanel = getChanel(this.lighthouseSensor);
  },
  methods: {
    sendMsgAsk() {
      if (this.selectedSensors.length <= 0) {
        return;
      }
      const hash = findKey(HASHES, item => xor(this.selectedSensors, item).length === 0);
      ask.objective = hash;
      web3.eth.getBlock('latest', (e, r) => {
        ask.deadline = r.number + 1000;
        message.sign(web3.eth.accounts[0], ask)
          .then(() => chanel.push(ask));
      });
    },
  },
};
</script>
