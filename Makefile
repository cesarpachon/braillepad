all:
	npm run build
	aws s3 cp build s3://test-materials/braillepad/ --recursive --acl public-read
