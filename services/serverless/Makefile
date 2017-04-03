STACK:=cali

deploy:
	npm install --production
	aws s3 mb s3://$(STACK)-lambdas || true
	aws cloudformation package --template-file cali.input.yaml --output-template-file cali.output.yaml --s3-bucket $(STACK)-lambdas
	aws cloudformation deploy --template-file cali.output.yaml --capabilities CAPABILITY_IAM --stack-name $(STACK)
