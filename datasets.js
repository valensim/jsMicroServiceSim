import {
  DatasetFacetsBuilder,
  InputDatasetBuilder,
  Ownership
} from "open-lineage-client";

let facet = new DatasetFacetsBuilder().setOwnership(new Ownership("kafka://test.com", "https://github.com/MarquezProject/marquez", [])).build()

let kafka = new InputDatasetBuilder().setName('Kafka_topic').setNamespace('kafka_host').build();
let kinesis = new InputDatasetBuilder().setName('Kinesis_Stream').setNamespace('Kinesis_Region').build();
let s3 = new InputDatasetBuilder().setName('S3_path').setNamespace('S3_bucket_and_region').build();
let rabbit = new InputDatasetBuilder().setName('rabbit').setNamespace('rabbit_namespace').build();
let elastic = new InputDatasetBuilder().setName('elastic_index_pattern').setNamespace('elastic_host').build();
let dynamo = new InputDatasetBuilder().setName('Dynamo_Table').setFacets(facet).setNamespace('Dynamo_Region').build();
let postgres = new InputDatasetBuilder().setName('Postgres_Table').setNamespace('Postgres_Host').build();
let api = new InputDatasetBuilder().setName('API').setNamespace('API_URL').build();

export {kinesis, kafka, s3, rabbit, elastic, dynamo, postgres, api};