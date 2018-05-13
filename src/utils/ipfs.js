import { open } from 'rosbag';
import axios from 'axios';

export default (hash, cb) => (
  axios.get(`https://ipfs.io/ipfs/${hash}`, {
    responseType: 'blob',
  })
    .then(r => open(r.data))
    .then((bag) => {
      bag.readMessages({ topics: ['/measurement'] }, (result) => {
        cb(result.message);
      });
    })
);
