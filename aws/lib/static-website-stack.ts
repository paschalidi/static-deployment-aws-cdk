import { CloudFrontWebDistribution } from "@aws-cdk/aws-cloudfront";
import { Bucket } from "@aws-cdk/aws-s3";
import { BucketDeployment, Source } from "@aws-cdk/aws-s3-deployment";
import { App, Stack } from "@aws-cdk/core";

export interface StaticWebsiteProps {
  websiteBuildFolder: string;
  indexDocument?: string;
}

export class StaticWebsiteStack extends Stack {
  constructor(
    scope: App,
    id: string,
    staticWebsiteConfiguration: StaticWebsiteProps
  ) {
    super(scope, id);

    const { indexDocument, websiteBuildFolder } = staticWebsiteConfiguration;
    const websiteIndexDocument = indexDocument || "index.html";
    const websiteBucket = new Bucket(this, "WebsiteBucket", {
      websiteIndexDocument,
      publicReadAccess: true
    });

    const distribution = new CloudFrontWebDistribution(this, "Distribution", {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: websiteBucket
          },
          behaviors: [
            {
              isDefaultBehavior: true
            }
          ]
        }
      ]
    });

    new BucketDeployment(this, "DeployWebsite", {
      sources: [Source.asset(websiteBuildFolder)],
      destinationBucket: websiteBucket,
      distribution,
      distributionPaths: ["/images/*.png"]
    });
  }
}
