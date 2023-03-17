const { request } = require("@octokit/request");
const { core } = require('@actions/core');

const result = await request('GET /repositories/{repository_id}/environments/{environment_name}/variables', {
  headers: {
    authorization: "token ${{ secrets.TEMP_PAT }}",
  },
  repository_id: '${{ github.repository_id }}',
  environment_name: 'test',
});

console.log(`${result.total_count} variables found`)

result.variables.forEach(function (item, index) {
  core.exportVariable(item['name'], item['value']);
});