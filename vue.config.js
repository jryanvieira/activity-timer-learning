module.exports = {
	transpileDependencies: ['pinia'],

	// Vue CLI 4 usa webpack 4, que não processa arquivos .mjs (ES Modules) de
	// node_modules corretamente. O Pinia por padrão aponta para pinia.mjs via
	// o campo "exports" do package.json, o que quebra o webpack 4.
	//
	// A solução é forçar o webpack a usar a versão CJS (CommonJS) do Pinia,
	// que é totalmente compatível com webpack 4:
	configureWebpack: {
		resolve: {
			alias: {
				// Redireciona qualquer import de 'pinia' para a versão CJS
				// em vez da versão .mjs que o webpack 4 não consegue processar
				'pinia': require.resolve('pinia/dist/pinia.cjs')
			}
		}
	}
};
