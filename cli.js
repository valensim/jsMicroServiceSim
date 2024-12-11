#!/usr/bin/env node

import fs from 'fs';
import readline from 'readline';
import {
  s3,
  kafka,
  rabbit,
  elastic,
  kinesis,
  dynamo,
  api,
  postgres
} from "./datasets.js";
import {Service} from "./service.js";

const producer = 'https://github.com/valensim/OpenLineageJSClient';
const schemaURL = 'https://github.com/valensim/OpenLineageJSClient';

// create  a list of the services match them based on the jobName and then call them in the switch
let transform = new Service('transform', 'transformNamespace', producer, schemaURL, [kinesis], [dynamo]);
let saver = new Service('saver', 'saverNamespace', producer, schemaURL, [kafka, api], [dynamo, rabbit]);
let analysis = new Service('analysis', 'analysisNamespace', producer, schemaURL, [s3], [postgres, s3]);
let replication = new Service('replication', 'replicationNamespace', producer, schemaURL, [dynamo], [s3, elastic]);
let enrichment = new Service('enrichment', 'enrichmentNamespace', producer, schemaURL, [rabbit], [kinesis]);
let jobs = [replication, saver, enrichment, transform, analysis];
let names = jobs.map((job) => job.jobName);

console.log('Enter a name of the service (' + names + ') and a command (start, running, end, latest):');

const inputFile = process.argv[2];
let inputStream = process.stdin;

if (inputFile) {
  inputStream = fs.createReadStream(inputFile);
}

const rl = readline.createInterface({
  input: inputStream,
  output: process.stdout
});

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
  if (!job) {
	console.log('Unknown job name. Use one of the following:', names);
	return;
  }

  switch (command) {
	case 'latest':
	  job.beLastRun();
	  break;
	case 'start':
	  job.startJob();
	  break;
	case 'running':
	  job.updateJob();
	  break;
	case 'end':
	  job.endJob();
	  break;
	default:
	  console.log('Unknown command. Use start, running, or end.');
  }
  console.log('Enter a name of the service (' + names + ') and a command (start, running, end, latest):');
});