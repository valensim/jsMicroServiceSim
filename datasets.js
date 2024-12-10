import {InputDatasetBuilder} from "open-lineage-client-js";

let kafka = new InputDatasetBuilder().setName('Kafka_topic').setNamespace('kafka_host').build();
let kinesis = new InputDatasetBuilder().setName('Kinesis_Stream').setNamespace('Kinesis_Region').build();
let s3 = new InputDatasetBuilder().setName('S3_path').setNamespace('S3_bucket_and_region').build();
let rabbit = new InputDatasetBuilder().setName('rabbit').setNamespace('rabbit_namespace').build();
let elastic = new InputDatasetBuilder().setName('elastic_index_pattern').setNamespace('elastic_host').build();
let dynamo = new InputDatasetBuilder().setName('Dynamo_Table').setNamespace('Dynamo_Region').build();

export {kinesis, kafka, s3, rabbit, elastic, dynamo};