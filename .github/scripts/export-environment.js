module.exports = async ({core}) => {
  const { request } = require("@octokit/request");

  core.startGroup("Exporting Variables");
  const vars = await request('GET /repositories/{repository_id}/environments/{environment_name}/variables', {
    headers: {
      authorization: "token ${{ secrets.TEMP_PAT }}",
    },
    repository_id: '${{ github.repository_id }}',
    environment_name: '${{ env.ENVIRONMENT }}',
  });

  console.log(`${vars.data.total_count} variables found`)
  vars.data.variables.forEach(function (item) {
    core.exportVariable(item['name'], item['value']);
  });
  core.endGroup();

  core.startGroup("Exporting Secrets");
  const secrets = await request('GET /repositories/{repository_id}/environments/{environment_name}/secrets', {
    headers: {
      authorization: "token ${{ secrets.TEMP_PAT }}",
    },
    repository_id: '${{ github.repository_id }}',
    environment_name: '${{ env.ENVIRONMENT }}',
  });
  console.log(`${secrets.data.total_count} secrets found`)

  secrets.data.secrets.forEach(function (item) {
    core.setSecret(item['value']);
    core.exportVariable(item['name'], item['value']);
  });

  core.endGroup();
}