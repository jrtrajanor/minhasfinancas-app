import React from 'react'
import { withRouter, Route } from 'react-router-dom'

import Card from '../../components/card'
import FormGroup from '../../components/form-group'
import SelectMenu from '../../components/selectMenu'
import LancamentoTable from './lancamentosTable'
import LancamentoService from '../../app/service/lancamentoService'
import LocalStorageService from '../../app/service/localStorageService'
import { mensagemSucesso, mensagemErro, mensagemAlerta } from '../../components/toastr'
import {Dialog} from 'primereact/dialog'
import {Button} from 'primereact/button'
import lancamentosTable from './lancamentosTable'

class ConsultaLancamentos extends React.Component {

    state = {
        ano: '',
        mes: '',
        tipo: '',
        descricao: '',
        showConfirmDialogDel: false,
        lancamentoDeletar: {},
        showConfirmAlteracaoStatus: false,
        lancamentoMudancaoStatus: {}, 
        statusAlterado: '',
        lancamentos: []
    }

    constructor() {
        super();
        this.lancamentoService = new LancamentoService();
    }

    consultar = () => {
        if (!this.state.ano) {
            mensagemErro('O preenchimento do campo Ano é obrigatório.');
            return false;
        }

        const usuarioLogado = LocalStorageService.obterItem('_usuario_logado');

        const lancamentoFiltro = {
            ano: this.state.ano,
            mes: this.state.mes,
            tipo: this.state.tipo,
            status: '',
            descricao: this.state.descricao,
            usuario: usuarioLogado.id
        }

        this.lancamentoService.consultar(lancamentoFiltro)
            .then(resposta => {
                const lista = resposta.data;
                
                if(lista.length < 1){
                    mensagemAlerta("Nenhum resultado encontrado.");
                } 
                
                this.setState({ lancamentos: lista })
            }).catch(error => {
                mensagemErro(error.resposta.data);
            });
    }

    editar = (id) => {
        this.props.history.push(`cadastro-lancamentos/${id}`);
    }

    abrirConfirmacaoDeletar = (lancamento) => {
        this.setState({showConfirmDialogDel: true, lancamentoDeletar: lancamento});
    }

    cancelarDelecao = () => {
        this.setState({showConfirmDialogDel: false, lancamentoDeletar: {}});
    }

    deletar = () => {
        this.lancamentoService.deletar(this.state.lancamentoDeletar.id)
            .then(response => {
                const index = this.state.lancamentos.indexOf(this.state.lancamentoDeletar);
                this.state.lancamentos.splice(index, 1);
                this.setState({lancamentos: this.state.lancamentos, showConfirmDialogDel: false});

                mensagemSucesso('Lançamento excluído com sucesso!');
            }).catch(erro => {
                mensagemErro('Ocorreu um erro ao excluir o lançamento. ');
            });
    }

    prepareCadastrar = () => {
        this.props.history.push('cadastro-lancamentos'); 
    }

    abrirConfirmacaoAlterarStatus = (lancamento, status) => {
        console.log('status: '+ status);
        console.log('Lancto: '+ lancamento);
        
        this.setState({showConfirmAlteracaoStatus: true, lancamentoMudancaoStatus: lancamento, statusAlterado: status});
    }

    cancelarAlteracaoStatus = () => {
        this.setState({showConfirmAlteracaoStatus: false, lancamentoMudancaoStatus: {}, statusAlterado: ''}); 
    }

    alterarStatus = () => {
        const statusAlterado = this.state.statusAlterado;

        this.lancamentoService.alterarStatus(this.state.lancamentoMudancaoStatus.id, statusAlterado)
            .then( response => {
                const lanctos = this.state.lancamentos; 
                const index = lanctos.indexOf(this.state.lancamentoMudancaoStatus); 

                if (index != -1){
                    this.state.lancamentoMudancaoStatus.status = statusAlterado;
                    lanctos.status = statusAlterado;
                    this.setState({lancamentos: lanctos, showConfirmAlteracaoStatus: false, statusAlterado: ''});
                }

                mensagemSucesso('Status atualizado com sucesso');
            }).catch(error => {
                mensagemErro(error.response.data);
            });
    }

    render() {
        const meses = this.lancamentoService.obterListaMeses();

        const tipos = this.lancamentoService.obterListaTipo();

        const confirmaDialogFooter = (
            <div>
                <Button label="Confirmar" icon="pi pi-check" onClick={this.deletar} />
                <Button label="Cancelar" icon="pi pi-times" onClick={this.cancelarDelecao} />
            </div>
        );

        const confirmaDialogFooterAlterarStatus = (
            <div>
                <Button label="Confirmar" icon="pi pi-check" onClick={this.alterarStatus} />
                <Button label="Cancelar" icon="pi pi-times" onClick={this.cancelarAlteracaoStatus} />
            </div>
        );

        return (
            <Card title="Consulta de lançamentos">
                <div className="row">
                    <div className="col-lg-6">
                        <div className="bs-component">
                            <FormGroup label="Ano: *" htmlFor="inputAno">
                                <input type="text"
                                    className="form-control"
                                    id="inputAno"
                                    value={this.state.ano}
                                    onChange={(e) => this.setState({ ano: e.target.value })}
                                    placeholder="Digite o ano" />
                            </FormGroup>
                            <FormGroup htmlFor="inputMes" label="Mês: *">
                                <SelectMenu className="form-control"
                                    id="idSelectMes"
                                    value={this.state.mes}
                                    onChange={(e) => this.setState({ mes: e.target.value })}
                                    lista={meses} />
                            </FormGroup>
                            <FormGroup htmlFor="inputTipo" label="Tipo de lançamento: ">
                                <SelectMenu className="form-control"
                                    id="idSelectTipo"
                                    value={this.state.tipo}
                                    onChange={e => this.setState({ tipo: e.target.value })}
                                    lista={tipos} />
                            </FormGroup>
                            <FormGroup label="Descrição: *" htmlFor="inputDesc">
                                <input type="text"
                                    className="form-control"
                                    id="inputDesc"
                                    value={this.state.descricao}
                                    onChange={(e) => this.setState({ descricao: e.target.value })}
                                    placeholder="Digite a descrição" />
                            </FormGroup>

                            <button onClick={this.consultar} 
                                    type="button" 
                                    className="btn btn-success">
                                    <i className= "pi pi-search"></i> Buscar</button>
                            <button onClick={this.prepareCadastrar} 
                                    type="button" 
                                    className="btn btn-danger">
                                    <i className= "pi pi-plus"></i> Cadastrar</button>
                        </div>
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="col-lg-12">
                        <div className="bs-component">
                            <LancamentoTable lancamentos={this.state.lancamentos}
                                actionEdit={this.editar}
                                actionDelete={this.abrirConfirmacaoDeletar}
                                alterarStatus={this.abrirConfirmacaoAlterarStatus} />
                        </div>
                    </div>
                </div>
                <div>
                    <Dialog header="Confirmação" 
                            visible={this.state.showConfirmDialogDel} 
                            style={{ width: '50vw' }} 
                            footer={confirmaDialogFooter}
                            modal={true} 
                            onHide={() => this.setState({ showConfirmDialogDel: false })}>
                        Confirma a exclusão do lançamento?
                    </Dialog>
                    <Dialog header="Confirmação" 
                            visible={this.state.showConfirmAlteracaoStatus} 
                            style={{ width: '50vw' }} 
                            footer={confirmaDialogFooterAlterarStatus}
                            modal={true} 
                            onHide={() => this.setState({ showConfirmAlteracaoStatus: false })}>
                        Confirma a mudança do status do lançamento para "{this.state.statusAlterado}"?
                    </Dialog>
                </div>
            </Card>
        )
    }
}

export default withRouter(ConsultaLancamentos)