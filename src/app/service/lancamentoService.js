import ApiService from '../apiService'

import ErroValidacao from '../exception/erroValidacao'
import { mensagemErro } from '../../components/toastr';

export default class LancamentoService extends ApiService{

    constructor(){
        super('/api/lancamentos');
    }

    obterListaMeses(){
        return [
            { label: 'Selecione...', value: '' },
            { label: 'Janeiro', value: 1 },
            { label: 'Fevereiro', value: 2 },
            { label: 'Março', value: 3 },
            { label: 'Abril', value: 4 },
            { label: 'Maio', value: 5 },
            { label: 'Junho', value: 6 },
            { label: 'Julho', value: 7 },
            { label: 'Agosto', value: 8 },
            { label: 'Setembro', value: 9 },
            { label: 'Outubro', value: 10 },
            { label: 'Novembro', value: 11 },
            { label: 'Dezembro', value: 12 },
        ]
    }

    obterListaTipo(){
        return [
            { label: 'Selecione...', value: '' },
            { label: 'Despesa', value: 'DESPESA' },
            { label: 'Receita', value: 'RECEITA' }
        ]
    }    

    consultar(lancamentoFiltros){
        let params = `?ano=${lancamentoFiltros.ano}`;

        if (lancamentoFiltros.mes){
            params = `${params}&mes=${lancamentoFiltros.mes}`
        }
        if (lancamentoFiltros.tipo){
            params = `${params}&tipo=${lancamentoFiltros.tipo}`
        }
        if (lancamentoFiltros.status){
            params = `${params}&status=${lancamentoFiltros.status}`
        }
        if (lancamentoFiltros.usuario){
            params = `${params}&usuario=${lancamentoFiltros.usuario}`
        }
        if (lancamentoFiltros.descricao){
            params = `${params}&descricao=${lancamentoFiltros.descricao}`
        }

        return this.get(params);
    }

    validar(lancamento){
        const erros = [];
        
        if (!lancamento.descricao){
            erros.push('O preenchimento do campo [Descrição] é obrigatório.');
        }
        if (!lancamento.ano){
            erros.push('O preenchimento do campo [Ano] é obrigatório.');
        }
        if (!lancamento.mes){
            erros.push('O preenchimento do campo [Mês] é obrigatório.');
        }
        if (!lancamento.valor || lancamento.valor <= 0){
            erros.push('O preenchimento do campo [Valor] é obrigatório.');
        }
        if (!lancamento.tipo){
            erros.push('O preenchimento do campo [Tipo] é obrigatório.');
        }

        if (erros && erros.length > 0){
            throw new ErroValidacao(erros);
        }
    }

    deletar(id){
        return this.delete(`/${id}`);
    }

    salvar(lancamento){
        return this.post('/', lancamento);
    }
    
    atualizar(lancamento){
        return this.put(`/${lancamento.id}`, lancamento);
    }

    alterarStatus(id, status){
        /*POSSO FAZER DESSE JEITO, DECLARANDO UMA VARIÁVEL
        const statusDTO = { status: status};
        OU fazendo da forma' que está sendo feito tipificada, pq o nome do parâmetro e o campo são iguais
        {status}
          */
        return this.put(`/${id}/atualiza-status`, {status});
    }

    obterPorId(id){
        return this.get(`/${id}`);
    }
}