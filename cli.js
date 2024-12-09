#!/usr/bin/env node

import readline from 'readline';
import {s3, kafka, rabbit, elastic} from "./datasets.js";
import {Service} from "./service.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const producer = 'https://github.com/valensim/OpenLineageJSClient';
const schemaURL = 'https://github.com/valensim/OpenLineageJSClient';

// create  a list of the services match them based on the jobName and then call them in the switch
let replication = new Service('replication', 'replicationNamespace', producer, schemaURL, [s3], [rabbit, elastic]);
let fetching = new Service('fetching', 'fetchingNamespace', producer, schemaURL, [kafka], [s3]);
let jobs = [replication, fetching];
let names = jobs.map((job) => job.jobName);

console.log('Enter a name of the service (' + names + ') and a command (start, running, end, latest):');

rl.on('line', (input) => {
  if (input.trim() === 'exit') {
	rl.close();
	return;
  }
  input = input.toLowerCase().trim().split(' ');
  if (input.length < 2) {
	console.log('Please provide a job name and a command.');
	return;
  }
  let jobName = input[0].trim();

  let command = input[1].trim();
  let job = jobs.find((job) => job.jobName === jobName);
  switch (command) {
	case 'latest':
	  job.getLastRun();
	  break;
	case 'start':
	  job.startJob();
	  break;
	case 'running':
	  job.updateJob();
	  break;
	case 'end':
	  job.endJob();
	  rl.close();
	  break;
	default:
	  console.log('Unknown command. Use start, running, or end.');
  }
  console.log('Enter a name of the service (' + names + ') and a command (start, running, end, latest):');
});