const fs = require('fs').promises;
const path = require('path');
const simpleGit = require('simple-git');
//const { createCanvas } = require('canvas');;
const { makeBadge, ValidationError } = require('badge-maker');

// Função principal
const main = async () => {
  const text1 = process.env.text-1;
  const text2 = process.env.text-2;
  
  //const token = process.env.token;

  // Colocar as opções de repo com owner atual quando passa só o nome do repo
  // owner com repo padrão quando passa so o nome do owner
  // repo e owner padrão quando não passa nada
  const repositoryRegistryName  = process.env.repo.split('/')[1];
  const repositoryRegistryOwner = process.env.repo.split('/')[0];
  // Logica do tipo de commit ou merge?
  // Não sei ainda se vai tudo pra master, ou vai ter branches por ternologia, sei lá.
  const branchRepositoryRegistry = process.env.branch;

  // Repositori Current
  const repositoryCurrentName  = process.env.GITHUB_REPOSITORY.split('/')[1];
  const repositoryCurrentOwner = process.env.GITHUB_REPOSITORY.split('/')[0];

  // const format = {
  //   label: 'build',
  //   message: 'passed',
  //   color: 'brightgreen',
  // }
  
  // const svg = makeBadge(format)
  // console.log(svg) // <svg...
  
  // try {
  //   makeBadge({})
  // } catch (e) {
  //   console.log(e) // ValidationError: Field `message` is required
  // }

  async function commitBadge() {
    // gera o badge
    const format = {
      label: "build",
      message: "passed",
      color: "brightgreen",
    };
    const svg = makeBadge(format);
  
    // inicializa o Octokit com o token do workflow
    const { Octokit } = await import('@octokit/rest');
    const octokit = new Octokit({ auth: process.env.token });
  
    // pega owner e repo do ambiente
    const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
  
    // caminho do arquivo dentro do repo
    const path = "badges/build.svg";
  
    // converte o SVG para base64
    const contentEncoded = Buffer.from(svg).toString("base64");
  
    // cria ou atualiza o arquivo na branch "teste"
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: "Add build badge",
      content: contentEncoded,
      branch: "teste",
    });
  
    console.log("Badge commitado com sucesso na branch teste!");
  }
  
  commitBadge().catch(err => {
    console.error("Erro ao commitar badge:", err);
  });

  
  // Verificar se a versão já está presente no badge remoto
  // console.log('Verificando versão atual do badge remoto...');
  // const { Octokit } = await import('@octokit/rest');
  // const octokit = new Octokit({ auth: process.env.token });

  // let remoteContent = '';
  // try {
  //   const { data } = await octokit.repos.getContent({
  //     owner: repositoryRegistryOwner,
  //     repo: repositoryRegistryName,
  //     path: `badges/${repositoryCurrentName}/${text1}.svg`,
  //     ref: branchRepositoryRegistry
  //   });
  
  //   if (data && data.content) {
  //     remoteContent = Buffer.from(data.content, 'base64').toString('utf-8');
  //   }
  // } catch (error) {
  //   if (error.status === 404) {
  //     console.log('⚠️ Badge remoto ainda não existe. Será criado.');
  //   } else {
  //     console.error(`❌ Erro ao buscar conteúdo remoto: ${error.message}`);
  //   }
  // }
  
  // // Extrair a versão atual do SVG
  // let versaoAtual = null;
  // if (remoteContent) {
  //   const match = remoteContent.match(/<tspan[^>]*>\s*([\d.]+)\s*<\/tspan>/g);
  //   if (match && match.length > 0) {
  //     const ultimaTag = match[match.length - 1];
  //     const versaoMatch = ultimaTag.match(/>([\d.]+)</);
  //     if (versaoMatch) {
  //       versaoAtual = versaoMatch[1];
  //       console.log(`✅ Versão atual encontrada no badge: ${versaoAtual}`);
  //     }
  //   }
  // }
  
  // // Comparar com a nova versão
  // if (versaoAtual === text2) {
  //   console.log(`⚠️ A versão "${text2}" já está presente no badge. Nenhuma ação será executada.`);
  //   return;
  // } else {
  //   console.log(`✅ A versão será atualizada de "${versaoAtual || 'nenhuma'}" para "${text2}". Continuando com o processo...`);
  // }

  // // Verificar se as variáveis estão definidas
  // if (!text1 || !text2 || !token || !repositoryCurrentName || !branchRepositoryRegistry) {
  //   throw new Error('Uma ou mais variáveis de ambiente não estão definidas.');
  // }

  // console.log(`============================================================`);
  // console.log(`Repository: ${repositoryCurrentName}`);
  // console.log(`Environment: ${text1}`);
  // console.log(`Version: ${text2}`);

  // const git = simpleGit();
  // // Variavel com o caminho do 
  // const repoPath = `${process.cwd()}/repo-clone`;

  // // Log do diretório atual
  // console.debug(`Diretório atual: ${process.cwd()}`);

  // // Clonar o repositório usando o token
  // console.log(`Clonando o repositório`);
  // try {
  //   await tentarComRetries(() =>
  //     git.clone(`https://oauth2:${token}@github.com/${repositoryRegistryOwner}/${repositoryRegistryName}.git`, repoPath, ['--branch', branchRepositoryRegistry]),
  //     2,
  //     500
  //   );
  //   console.log(`Repositório clonado para o diretório ${repoPath}.`);
  // } catch (error) {
  //   console.error(`Erro ao clonar o repositório: ${error}`);
  //   return;
  // }

  // // Configurar identidade do autor
  // console.log('Configurando identidade do autor...');
  // try {
  //   const emailConfigResult = await git.cwd(repoPath).addConfig('user.email', 'badge@action.com');
  //   const nameConfigResult = await git.cwd(repoPath).addConfig('user.name', 'Badge Action');
  //   console.log('Identidade do autor configurada.');
  // } catch (error) {
  //   console.error(`Erro ao configurar a identidade do autor: ${error}`);
  //   return;
  // }

  // // Configurações do badge
  // const config = {
  //   colors: {
  //     workflowGradientStart: "#444D56",
  //     workflowGradientEnd: "#24292E",
  //     stateGradientStart: "#959DA5",
  //     stateGradientEnd: "#6A737D",
  //     textShadow: "#010101",
  //     text: "#FFFFFF"
  //   },
  //   fontFamily: "'DejaVu Sans',Verdana,Geneva,sans-serif",
  //   fontSize: 11
  // };
  
  // const measureTextWidth = (text, font) => {
  //   const canvas = createCanvas(200, 50);
  //   const context = canvas.getContext("2d");
  //   context.font = font;
  //   return context.measureText(text).width;
  // };
  
  // const workflowWidth = measureTextWidth(text1, `${config.fontSize}px ${config.fontFamily}`) + 28; // 14px padding on each side
  // const stateWidth = measureTextWidth(text2, `${config.fontSize}px ${config.fontFamily}`) + 12; // 6px padding on each side
  
  // const badge = `
  //   <svg xmlns="http://www.w3.org/2000/svg" width="${workflowWidth + stateWidth + 4}" height="20">
  //     <title>${text1} - ${text2}</title>
  //     <defs>
  //       <linearGradient id="workflow-fill" x1="50%" y1="0%" x2="50%" y2="100%">
  //         <stop stop-color="${config.colors.workflowGradientStart}" offset="0%"/>
  //         <stop stop-color="${config.colors.workflowGradientEnd}" offset="100%"/>
  //       </linearGradient>
  //       <linearGradient id="state-fill" x1="50%" y1="0%" x2="50%" y2="100%">
  //         <stop stop-color="${config.colors.stateGradientStart}" offset="0%"/>
  //         <stop stop-color="${config.colors.stateGradientEnd}" offset="100%"/>
  //       </linearGradient>
  //     </defs>
  //     <g fill="none" fill-rule="evenodd">
  //       <g font-family="${config.fontFamily}" font-size="${config.fontSize}">
  //         <path id="workflow-bg" d="M0,3 C0,1.3431 1.3552,0 3,0 L${workflowWidth},0 L${workflowWidth},20 L3,20 C1.3552,20 0,18.6569 0,17 L0,3 Z" fill="url(#workflow-fill)" fill-rule="nonzero" rx="5" ry="5"/>
  //         <text fill="${config.colors.textShadow}" fill-opacity=".3">
  //           <tspan x="14" y="15" aria-hidden="true">${text1}</tspan>
  //         </text>
  //         <text fill="${config.colors.text}">
  //           <tspan x="14" y="14">${text1}</tspan>
  //         </text>
  //       </g>
  //       <g transform="translate(${workflowWidth})" font-family="${config.fontFamily}" font-size="${config.fontSize}">
  //         <path d="M0 0h${stateWidth}C${stateWidth + 1.103} 0 ${stateWidth + 3} 1.343 ${stateWidth + 3} 3v14c0 1.657-1.39 3-3.103 3H0V0z" id="state-bg" fill="url(#state-fill)" fill-rule="nonzero" rx="5" ry="5"/>
  //         <text fill="${config.colors.textShadow}" fill-opacity=".3" aria-hidden="true">
  //           <tspan x="6" y="15">${text2}</tspan>
  //         </text>
  //         <text fill="${config.colors.text}">
  //           <tspan x="6" y="14">${text2}</tspan>
  //         </text>
  //       </g>
  //     </g>
  //   </svg>`;

  // const fileName = `${repoPath}/badges/${repositoryCurrentName}/${text1}.svg`;
  
  // console.log(`File Name: ${fileName}`);

  // // Certifique-se de que o diretório existe
  // const dir = path.dirname(fileName);
  // try {
  //   await fs.mkdir(dir, { recursive: true });
  //   console.log(`Diretorio criado: ${dir}`);
  // } catch (error) {
  //   console.error(`Error na criação do diretorio: ${error.message}`);
  //   return;
  // }

  // try {
  //   await fs.writeFile(fileName, badge);
  //   console.log(`Badge written to file: ${fileName}`);
  // } catch (error) {
  //   console.error(`Error writing file: ${error.message}`);
  //   return;
  // }

  // // Adiciona o arquivo ao Git
  // console.log(`Adicionando a badge no Git.`);
  // try {
  //   const addResult = await git.cwd(repoPath).add(fileName);
  //   console.log(`${fileName} foi adicionado ao Git.`);
  // } catch (error) {
  //   console.error(`Erro ao adicionar o arquivo ao Git: ${error}`);
  //   return;
  // }

  // // Faz o commit
  // const commitMessage = `Update badges: ${text1} - ${text2}`;
  // console.log(`Fazendo commit com a mensagem: "${commitMessage}"...`);
  // try {
  //   const commitResult = await git.cwd(repoPath).commit(commitMessage);
  //   console.log(`Commit realizado. ${commitResult}`);
  // } catch (error) {
  //   console.error(`Erro ao fazer o commit: ${error}`);
  // }

  // // Criar uma nova branch para o pull request
  // const prBranch = `${repositoryCurrentName}-${text1}-${text2}`;
  // console.log(`Criando nova branch: ${prBranch}...`);
  // try {
  //   const checkoutResult = await git.cwd(repoPath).checkoutLocalBranch(prBranch);
  //   console.log(`Nova branch criada: ${prBranch}`);
  //   // console.log(`Resultado do checkout: ${JSON.stringify(checkoutResult)}`);
  // } catch (error) {
  //   console.error(`Erro ao criar nova branch: ${error}`);
  // }

  // // Subir a nova branch (push)
  // console.log(`Fazendo push para ${repositoryRegistryName} na branch ${prBranch}...`);
  // try {
  //   await tentarComRetries(() =>
  //     git.cwd(repoPath).push([`https://oauth2:${token}@github.com/${repositoryRegistryOwner}/${repositoryRegistryName}.git`, prBranch, '--force']),
  //     2,
  //     2000
  //   );
  //   console.log(`Nova branch enviada.`);
  // } catch (error) {
  //   console.error(`Erro ao fazer o push: ${error}`);
  //   return;
  // }

  // // Criar o pull request
  // console.log(`Criando pull request...`);
  // let prResult; 
  // try {
  //   prResult = await tentarComRetries(() =>
  //     octokit.pulls.create({
  //       owner: repositoryRegistryOwner,
  //       repo: repositoryRegistryName,
  //       title: `Update badge: ${text1} - ${text2}`,
  //       head: prBranch,
  //       base: branchRepositoryRegistry,
  //       body: `Badge ambiente: ${text1} versão: ${text2}.`
  //     }),
  //     5,
  //     2000
  //   );
  //   console.log(`Pull request criado.`);
  // } catch (error) {
  //   console.error(`Erro ao criar o pull request: ${error}`);
  //   return;
  // }

  // // Adicionar a label 'badge' ao pull request
  // const issueNumber = prResult.data.number;
  // try {
  //   await octokit.issues.addLabels({
  //     owner: repositoryRegistryOwner,
  //     repo: repositoryRegistryName,
  //     issue_number: issueNumber,
  //     labels: ['badge']
  //   });
  //   console.log(`Label 'badge' adicionada ao pull request.`);
  // } catch (error) {
  //   console.error(`Erro ao adicionar a label 'badge': ${error}`);
  // }

  // // Adicionar a milestone 'Badges' ao pull request
  // const milestones = await octokit.issues.listMilestones({
  //   owner: repositoryRegistryOwner,
  //   repo: repositoryRegistryName
  // });
  // const milestone = milestones.data.find(m => m.title === 'Badges');
  // if (milestone) {
  //   await octokit.issues.update({
  //     owner: repositoryRegistryOwner,
  //     repo: repositoryRegistryName,
  //     issue_number: issueNumber,
  //     milestone: milestone.number
  //   });
  //   console.log(`Milestone 'Badges' adicionada ao pull request.`);
  // } else {
  //   console.log(`Milestone 'Badges' não encontrada.`);
  // }

  // // Tentativas de merge com bypass das regras de proteção
  // const maxAttempts = 10;
  // let attempt = 0;
  // let mergeSuccess = false;

  // while (attempt < maxAttempts && !mergeSuccess) {
  //   attempt++;
  //   console.log(`      Tentativa ${attempt}: Atualizando a branch do pull request com as últimas mudanças da branch base...`);
  //   await git.cwd(repoPath).fetch('origin', branchRepositoryRegistry);
  //   await git.cwd(repoPath).mergeFromTo(branchRepositoryRegistry, prBranch);
  //   console.log(`Branch atualizada.`);

  //   // Fazer o merge do pull request com bypass das regras de proteção
  //   console.log(`      Tentativa ${attempt}: Fazendo merge do pull request...`);
  //   try {
  //     const mergeResult = await octokit.pulls.merge({
  //       owner: repositoryRegistryOwner,
  //       repo: repositoryRegistryName,
  //       pull_number: issueNumber,
  //       merge_method: 'merge',
  //       bypass_rules: true // Adiciona a opção de bypass das regras de proteção
  //     });
  //     console.log(`Pull request merged.`);
  //     // console.log(`Resultado do merge: ${JSON.stringify(mergeResult)}`);

  //     // Verificar se o merge foi bem-sucedido
  //     if (mergeResult.status === 200) {
  //       mergeSuccess = true;
  //       console.log(`Merge realizado com sucesso na tentativa ${attempt}.`);

  //       // Excluir a branch local e remota via API
  //       console.log(`Excluindo a branch ${prBranch} via API...`);
  //       try {
  //         const deleteResult = await octokit.git.deleteRef({
  //           owner: repositoryRegistryOwner,
  //           repo: repositoryRegistryName,
  //           ref: `heads/${prBranch}`
  //         });
  //         if (deleteResult.status === 204) {
  //           console.log(`✅ Branch ${prBranch} excluída com sucesso via API (status 204).`);
  //         } else {
  //           console.warn(`⚠️ Exclusão da branch retornou status inesperado: ${deleteResult.status}`);
  //         }
  //       } catch (error) {
  //         console.error(`Erro ao excluir a branch ${prBranch} via API: ${error.message}`);
  //       }
  //     } else {
  //       console.log(`Merge não realizado na tentativa ${attempt}.`);
  //     }
  //   } catch (mergeError) {
  //     console.error(`Erro ao fazer o merge na tentativa ${attempt}: ${mergeError}`);
  //   }
  // }

  // if (!mergeSuccess) {
  //   console.error(`Falha ao realizar o merge após ${maxAttempts} tentativas.`);
  // }


  // // Limpar o repositório local
  // console.log('Limpando o repositório local...');
  // try {
  //   await fs.rm(repoPath, { recursive: true, force: true });
  //   console.log('Repositório local limpo.');
  // } catch (error) {
  //   console.error(`Erro ao limpar o repositório local: ${error.message}`);
  // }
};

// Executa a função principal
main();
