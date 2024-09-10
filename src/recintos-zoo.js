class RecintosZoo {
    constructor() {
        this.recintos = [
            { numero: 1, bioma: 'savana', tamanhoTotal: 10, animais: [{ especie: 'MACACO', quantidade: 3 }] },
            { numero: 2, bioma: 'floresta', tamanhoTotal: 5, animais: [] },
            { numero: 3, bioma: 'savana e rio', tamanhoTotal: 7, animais: [{ especie: 'GAZELA', quantidade: 1 }] },
            { numero: 4, bioma: 'rio', tamanhoTotal: 8, animais: [] },
            { numero: 5, bioma: 'savana', tamanhoTotal: 9, animais: [{ especie: 'LEAO', quantidade: 1 }] }
        ];
        this.propriedadesDosAnimais = {
            HIPOPOTAMO: { tamanho: 4, biomas: ['savana', 'rio'], carnivoro: false },
            CROCODILO: { tamanho: 3, biomas: ['rio'], carnivoro: true },
            LEOPARDO: { tamanho: 2, biomas: ['savana'], carnivoro: true },
            GAZELA: { tamanho: 2, biomas: ['savana'], carnivoro: false },
            MACACO: { tamanho: 1, biomas: ['savana', 'floresta'], carnivoro: false },
            LEAO: { tamanho: 3, biomas: ['savana'], carnivoro: true }
        };
    }

    analisaRecintos(animal, quantidade) {
        if (!this.propriedadesDosAnimais[animal]) {
            return { erro: 'Animal inválido' };
        }

        if (quantidade <= 0 || !Number.isInteger(quantidade)) {
            return { erro: 'Quantidade inválida' };
        }

        const caracteristicasDoAnimal = this.propriedadesDosAnimais[animal];
        const tamanhoQueOcupa = caracteristicasDoAnimal.tamanho * quantidade;
        const recintosViaveis = [];

        for (let c = 0; c < this.recintos.length; c += 1) {
            let recinto = this.recintos[c];
            let espacoOcupado = 0;

            // Calcula o espaço ocupado pelos animais no recinto
            for (let num = 0; num < recinto.animais.length; num += 1) {
                let bicho = recinto.animais[num];
                espacoOcupado += this.propriedadesDosAnimais[bicho.especie].tamanho * bicho.quantidade;
            }

            let espacoLivre = recinto.tamanhoTotal - espacoOcupado;

            // Verifica se o bioma do recinto é compatível com o animal
            let biomaCompatível = caracteristicasDoAnimal.biomas.some(bioma => bioma === recinto.bioma || recinto.bioma === 'savana e rio');

            if (!biomaCompatível) continue;

            // Verifica se o animal pode conviver com outros animais no recinto
            let temCarnivoro = false;
            let especiesIguais = false;

            for (let num = 0; num < recinto.animais.length; num += 1) {
                let bicho = recinto.animais[num];
                if (this.propriedadesDosAnimais[bicho.especie].carnivoro) {
                    temCarnivoro = true;
                    if (animal === bicho.especie) especiesIguais = true;
                }
            }

            if (caracteristicasDoAnimal.carnivoro && temCarnivoro && !especiesIguais) continue;

            let podemConviver = true;

            // Hipopótamos só podem conviver com outras espécies se o recinto for "savana e rio"
            if (animal === 'HIPOPOTAMO' && recinto.animais.length > 0 && recinto.bioma !== 'savana e rio') {
                podemConviver = false;
            }

            // Verifica a convivência de animais com diferentes tipos
            for (let num = 0; num < recinto.animais.length; num += 1) {
                let animalExistente = recinto.animais[num];
                let caracteristicasAnimalExistente = this.propriedadesDosAnimais[animalExistente.especie];

                if ((caracteristicasAnimalExistente.carnivoro || caracteristicasDoAnimal.carnivoro) && (!especiesIguais)) {
                    podemConviver = false;
                    break;
                }
            }

            // Macacos não podem ficar sozinhos
            if (caracteristicasDoAnimal.especie === 'MACACO' && recinto.animais.length === 0) {
                podemConviver = false;
            }

            if (!podemConviver) continue;

            // Calcula o espaço que precisa
            let espacoNecessario = tamanhoQueOcupa;
            let misturaEspecies = recinto.animais.some(animalExistente => animalExistente.especie !== animal);

            if (misturaEspecies) espacoNecessario += 1;

            // Verifica se tem espaço suficiente no recinto
            if (espacoLivre >= espacoNecessario) {
                recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${espacoLivre - espacoNecessario} total: ${recinto.tamanhoTotal})`);
            }
        }

        if (recintosViaveis.length === 0) {
            return { erro: 'Não há recinto viável' };
        }

        return { recintosViaveis };
    }
}

export { RecintosZoo };
