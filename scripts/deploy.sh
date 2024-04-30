export $(grep -v '^#' .env)

timestamp=$(date +%Y-%m-%d-%H%M%S)

rm ./$SSH_BUILD*.zip
zip -r -q - $SSH_BUILD > $SSH_BUILD-$timestamp.zip
ssh -i $SSH_IDENTITY $SSH_USER@$SSH_HOST "cd $SSH_DIR; rm -R ./*; echo \"removed old build\""
scp -i $SSH_IDENTITY $SSH_BUILD-$timestamp.zip $SSH_USER@$SSH_HOST:$SSH_DIR
ssh -i $SSH_IDENTITY $SSH_USER@$SSH_HOST "cd $SSH_DIR; unzip -q ./$SSH_BUILD-$timestamp.zip -d ./; mv ./$SSH_BUILD/* ./; echo \"done building!\""