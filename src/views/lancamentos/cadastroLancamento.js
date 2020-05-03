import React from 'react'

import { withRouter } from 'react-router-dom'
import formatter from 'currency-formatter'

import Card from '../../components/card'
import FormGroup from '../../components/form-group'
import SelectMenu from '../../components/selectMenu'
import LancamentoService from '../../app/service/lancamentoService'
import {mensagemSucesso, mensagemErro, mensagemAlerta} from '../../components/toastr'
import LocalStorage from '../../app/service/localStorageService'

class CadastroLancamento extends React.Component{

    state = {
        id: null,
        descricao: '',
        ano: '',
        mes: '',
        valor: '',
        tipo: '',
        usuario: null,
        status: '',
        atualizando: false
    }

    constructor(){
        super();
        this.lancamentoService = new LancamentoService();
    }

    componentDidMount(){
        const params = this.props.match.params;
        if (params.id){
            this.lancamentoService.obterPorId(params.id)
                .then( response => {
                    this.setState( {...response.data, atualizando: true} );
                }).catch(error => {
                    mensagemErro(error.response.data);
                });
        }

        console.log(params);
    }

    handleChange = (event) => {
        const value = event.target.value;
        const name  = event.target.name;

        this.setState({ [name] : value });        
    }

    validar = () => {
        const lancamento = this.prepareDadosPersistencia();

        try{
            this.lancamentoService.validar(lancamento);
        }catch(erro){
            const msgs = erro.mensagens;
            msgs.forEach(msg => mensagemAlerta(msg));

            console.log('Erro validação'+ erro.mensagens);
            return false;
        }

        if (this.state.id){
            return this.atualizar(lancamento);
        }else{
            return this.salvar(lancamento);
        }
    }

    prepareDadosPersistencia = () => {
        if (this.EhNovoLancamento()){
            const usuario = LocalStorage.obterItem('_usuario_logado');
            this.setState({usuario: usuario.id});

            const { descricao, valor, mes, ano, tipo } = this.state;
            const lancamento = { descricao, valor, mes, ano, tipo, usuario: usuario.id };
            
            return lancamento;
        }else{
            const { descricao, valor, mes, ano, tipo, id, usuario, status } = this.state;
            const lancamento = { descricao, valor, mes, ano, tipo, id, usuario, status };

            return lancamento;
        }
    }

    EhNovoLancamento = () =>{
        if (this.state.id){
            return false;
        }    

        return true;        
    }

    salvar = (lancamento) => {
        return this.lancamentoService.salvar(lancamento)
            .then( response => {
                mensagemSucesso('Lançamento realizado com sucesso');
                this.props.history.push('/consulta-lancamentos');
            }).catch( error => {
                mensagemErro(error.response.data);
            });
    }

    atualizar = (lancamento) => {
        return this.lancamentoService.atualizar(lancamento)
            .then( response => {
                this.props.history.push('/consulta-lancamentos');
                mensagemSucesso('Lançamento atualizado com sucesso');
            }).catch( error => {
                mensagemErro(error.response.data);
            });
    }

    preparaConsultar = () => {
        this.props.history.push('/consulta-lancamentos');
    }

    render() {
        const meses = this.lancamentoService.obterListaMeses();
        const tipos = this.lancamentoService.obterListaTipo();

        return (
            <Card title={this.state.atualizando ? 'Atualizando lançamento' : 'Cadastro de lançamentos'} >
                <div className="row">
                    <div className="col-lg-12">
                        <FormGroup id="inputDescricao" label="Descrição: *"> 
                            <input id="inputDescricao" 
                                   type="text" 
                                   className="form-control"
                                   name="descricao"
                                   value={this.state.descricao}
                                   onChange={this.handleChange} />
                        </FormGroup>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-6">
                        <FormGroup id="inputAno" label="Ano: *"> 
                            <input id="inputAno" 
                                   type="text" 
                                   className="form-control"
                                   name="ano"
                                   value={this.state.ano}
                                   onChange={this.handleChange} />
                        </FormGroup>
                    </div>
                    <div className="col-lg-6">
                        <FormGroup htmlFor="inputMes" label="Mês: *">
                                <SelectMenu className="form-control"
                                    id="idSelectMes"
                                    name="mes"
                                    value={this.state.mes}
                                    onChange={this.handleChange}
                                    lista={meses} />
                        </FormGroup>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-4">
                        <FormGroup id="inputValor" label="Valor: *">
                            <input id="inputValor" 
                                   type="number"
                                   pattern="[0-9]+R$"
                                   className="form-control text-left"
                                   name="valor"
                                   value={this.state.valor}
                                   onChange={this.handleChange}/>        
                        </FormGroup>
                    </div>
                    <div className="col-lg-4">
                        <FormGroup id="inputTipo" label="Tipo: *">
                            <SelectMenu className="form-control" 
                                        id="inputTipo"
                                        name="tipo"
                                        value={this.state.tipo}
                                        onChange={this.handleChange}
                                        lista={tipos} />
                        </FormGroup>
                    </div> 
                    <div className="col-lg-4">
                        <FormGroup id="inputStatus" label="Status: *">
                            <input id="inputStatus" 
                                   type="text" 
                                   name="status"
                                   value={this.state.status}
                                   className="form-control" disabled/>
                        </FormGroup>
                    </div> 
                </div>
                <div className="row">
                    <div className="col-lg-6">
                        <button onClick={this.validar} 
                                className="btn btn-success">
                                <i className={this.state.atualizando ? "pi pi-refresh": "pi pi-save"}></i>
                                {this.state.atualizando ? ' Atualizar' : ' Salvar'}
                        </button>
                        <button onClick={this.preparaConsultar} 
                                className="btn btn-danger">
                                <i className= "pi pi-arrow-left"></i> Voltar</button>
                    </div>
                </div>
            </Card>
        )
    }

}

export default withRouter(CadastroLancamento)