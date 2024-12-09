import {InputDatasetBuilder} from "open-lineage-client-js";

let kafka = new InputDatasetBuilder().setName('Kafka').setNamespace('kafkaNamespace').build();
let s3 = new InputDatasetBuilder().setName('S3').setNamespace('s3Namespace').build();
let rabbit = new InputDatasetBuilder().setName('rabbit').setNamespace('rabbitNamespace').build();
let elastic = new InputDatasetBuilder().setName('elastic').setNamespace('elasticNamespace').build();

export {kafka, s3, rabbit, elastic};