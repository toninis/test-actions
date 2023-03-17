const { request } = require("@octokit/request");
const { core } = require('@actions/core');

const run = async function run() {

  const result = await request('GET /repositories/{repository_id}/environments/{environment_name}/variables', {
    headers: {
      authorization: "token " + process.env.TOKEN,
    },
    repository_id: process.env.REPOSITORY_ID,
    environment_name: process.env.ENVIRONMENT,
  });
  
  console.log(`${result.data.total_count} variables found`)
  
  result.data.variables.forEach(function (item) {
    core.exportVariable(item['name'], item['value']);
  });

}

run();
