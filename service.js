import {
  EventType,
  JobBuilder,
  JobFacetsBuilder,
  JobType,
  OpenLineageClient,
  RunBuilder,
  RunEventBuilder
} from "open-lineage-client";
import {v4 as uuidv4} from 'uuid';
import {default as axios} from 'axios';

export async function getRuns(name, namespace) {
  //  url: 'http://localhost:5000/api/v1/namespaces/:namespace/jobs/:job/runs',
  let config = {
	method: 'get',
	maxBodyLength: Infinity,
	url: `http://localhost:8080/api/v1/namespaces/${namespace}/jobs/${name}/runs`,
	headers: {
	  'Accept': 'application/json'
	}
  };

  return await axios(config);
}

class Service {
  constructor(jobName, jobNamespace, producer, schemaURL, inputs, outputs) {
	this.jobName = jobName;
	this.jobNamespace = jobNamespace;
	this.inputs = inputs;
	this.outputs = outputs;
	this.runId = uuidv4();
	this.producer = producer;
	this.schemaURL = schemaURL;
	this.client = new OpenLineageClient();
	console.log(this.client);
	this.run = new RunBuilder().setRunId(this.runId).build();
  }

  async getLastRun() {
	let response = await getRuns(this.jobName, this.jobNamespace);
	console.log('Runs:', response.data);
	return response.data.runs[0];
  }

  async beLastRun() {
	const lastRun = await this.getLastRun();
	if (lastRun) {
	  this.runId = lastRun.id;
	  this.run = new RunBuilder().setRunId(this.runId).build();
	  console.log('Last runId:', this.runId);
	} else {
	  console.log('No previous runs.');
	}
  }

  startJob() {
	const jobFacets = new JobFacetsBuilder().setJobType(
		new JobType(this.producer, this.schemaURL, 'BATCH', 'integration',
			'job')).build();
	const job = new JobBuilder().setNamespace(this.jobNamespace).setName(
		this.jobName).addFacets(jobFacets).build();
	const event = new RunEventBuilder(new Date().toISOString(), this.producer,
		this.schemaURL, EventType.START)
	.setRun(this.run)
	.setJob(job)
	.setInputs(this.inputs)
	.setOutputs(this.outputs)
	.build();
	this.client.emit(event);
	console.log('Job started with runId:', this.runId);
  }

  updateJob() {
	const jobFacets = new JobFacetsBuilder().setJobType(
		new JobType(this.producer, this.schemaURL, 'STREAMING', 'integration',
			'job')).build();
	const job = new JobBuilder().setNamespace(this.jobNamespace).setName(
		this.jobName).addFacets(jobFacets).build();
	const event = new RunEventBuilder(new Date().toISOString(), this.producer,
		this.schemaURL, EventType.RUNNING).setJob(job).setRun(
		this.run).setInputs(this.inputs).setOutputs(this.outputs).build();
	this.client.emit(event);
	if (!this.runId) {
	  console.log('Job has not been started.');
	  return;
	}
	console.log('Job running with runId:', this.runId);
  }

  endJob() {
	if (!this.runId) {
	  console.log('Job has not been started.');
	  return;
	}
	const job = new JobBuilder().setNamespace(this.jobNamespace).setName(
		this.jobName).build();
	const event = new RunEventBuilder(new Date().toISOString(), this.producer,
		this.schemaURL, EventType.COMPLETE)
	.setRun(this.run)
	.setJob(job)
	.setInputs(this.inputs)
	.setOutputs(this.outputs)
	.build();
	this.client.emit(event);
	console.log('Job ended with runId:', this.runId);
	this.runId = null;
  }
}

export {Service};
