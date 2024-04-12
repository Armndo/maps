export $(grep -v '^#' .env)

timestamp=$(date +%Y_%m_%d_%H%M%S)

rm build*.zip
zip -r -q - build > build_$timestamp.zip
ssh -i $SSH_IDENTITY $SSH_USER@$SSH_HOST "cd $SSH_DIR; rm -R ./build; rm ./*.zip; echo \"removed old build\""
scp -i $SSH_IDENTITY build_$timestamp.zip $SSH_USER@$SSH_HOST:$SSH_DIR
ssh -i $SSH_IDENTITY $SSH_USER@$SSH_HOST "cd $SSH_DIR; unzip -q ./build_$timestamp.zip -d ./; echo \"done building!\""