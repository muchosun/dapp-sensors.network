<template>
  <div>
    <div class="secw-narrow">
        <h2>4. WATCH MARKET</h2>
    </div>
    <div class="secw-base step-2-market">
      <section class="sec-white">
        <div class="row">
          <div class="col-md-6">
            <h3>Sensors data demand</h3>
            <div>
              <p class="t-break" v-for="(item, i) in asks" :key="i">
                <b>account: </b>{{ item.account }}<br/>
                <b>model: </b><a :href="`https://ipfs.io/ipfs/${item.model}`" target="_blank">{{ item.model }}</a><br/>
                <b>objective: </b><a :href="`https://ipfs.io/ipfs/${item.objective}`" target="_blank">{{ item.objective }}</a><br/>
                <b>token: </b>{{ item.token }}<br/>
                <b>cost: </b>{{ item.cost }}<br/>
                <b>count: </b>{{ item.count }}<br/>
                <b>validatorFee: </b>{{ item.validatorFee }}<br/>
                <b>deadline: </b>{{ item.deadline }}
              </p>
            </div>
          </div>
          <div class="col-md-6">
            <h3>Created smart contract</h3>
            <div>
              <p class="t-break" v-for="(item, i) in lis" :key="i">
                <a :href="`https://kovan.etherscan.io/address/${item.address}`" target="_blank">{{ item.address }}</a><br/>
                <b>lighthouse: </b><a :href="`https://kovan.etherscan.io/address/${item.lighthouse}`" target="_blank">{{ item.lighthouse }}</a><br/>
                <b>from: </b><a :href="`https://kovan.etherscan.io/address/${item.from}`" target="_blank">{{ item.from }}</a><br/>
                <b>model: </b><a :href="`https://ipfs.io/ipfs/${item.model}`" target="_blank">{{ item.model }}</a><br/>
                <b>objective: </b><a :href="`https://ipfs.io/ipfs/${item.objective}`" target="_blank">{{ item.objective }}</a><br/>
                <b>token: </b>{{ item.token }}<br/>
                <b>promisee: </b>{{ item.promisee }}<br/>
                <b>promisor: </b>{{ item.promisor }}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
    <div class="secw-narrow">
        <h2>5. Results from IPFS</h2>
    </div>
    <div class="secw-base step-2-market">
      <section class="sec-white">
        <div class="row">
          <div class="col-md-6">
            <div>
              <p class="t-break" v-for="(item, i) in lis" :key="i">
                <a :href="`https://kovan.etherscan.io/address/${item.address}`" target="_blank">{{ item.address }}</a><br/>
                <span v-if="item.result != ''">
                  <b>Result: </b><a :href="`https://ipfs.io/ipfs/${item.result}`" target="_blank">{{ item.result }}</a><br/>
                  <span v-for="(res, resIndex) in item.resultMessage" :key="resIndex">
                    {{ res }}<br />
                  </span>
                </span>
                <span v-if="item.result == ''">
                  <b>Results: </b>...<br/>
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import robonomics, { getChanel } from '../utils/robonomics';
import ipfsBagCat from '../utils/ipfs';
import { LIGHTHOUSE_SENSOR } from '../config';

let chanel;

export default {
  name: 'Step14',
  data() {
    return {
      lighthouse: LIGHTHOUSE_SENSOR,
      asks: [],
      bids: [],
      lis: [],
    };
  },
  created() {
    chanel = getChanel(this.lighthouse);
    this.fetchData();
  },
  methods: {
    fetchData() {
      const interval = {};
      robonomics.factory.watchLiability((liability, result) => {
        web3.eth.getTransaction(result.transactionHash, (e, r) => {
          if (r.to.toLowerCase() === this.lighthouse.toLowerCase()) {
            liability.getInfo()
              .then((info) => {
                if (!find(this.lis, { address: liability.address }) &&
                  web3.toChecksumAddress(web3.eth.accounts[0]) ===
                  web3.toChecksumAddress(info.promisee)) {
                  this.lis = [
                    {
                      lighthouse: r.to,
                      from: r.from,
                      address: liability.address,
                      ...info,
                      resultMessage: [],
                    },
                    ...this.lis,
                  ];

                  interval[liability.address] = setInterval(() => {
                    const wL = liability;
                    wL.getInfo()
                      .then((infoUp) => {
                        if (infoUp.finalized) {
                          const i = findIndex(this.lis, { address: wL.address });
                          this.lis[i].result = infoUp.result;
                          ipfsBagCat(infoUp.result, (bag) => {
                            this.lis[i].resultMessage.push(bag.data);
                          });
                          clearInterval(interval[wL.address]);
                        }
                      });
                  }, 5000);
                }
              });
          }
        });
      });

      chanel.asks((msg) => {
        const acc = msg.recover();
        if (web3.toChecksumAddress(web3.eth.accounts[0]) === acc) {
          this.asks = [{ ...msg, account: acc }, ...this.asks];
        }
      });
    },
  },
};
</script>
