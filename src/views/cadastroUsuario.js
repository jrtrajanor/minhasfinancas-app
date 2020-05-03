import React from 'react'
import {withRouter} from 'react-router-dom'

import Card from '../components/card'
import FormGroup from '../components/form-group'
import UsuarioService from '../app/service/usuarioService'
import {mensagemSucesso, mensagemErro, mensagemAlerta} from '../components/toastr'

class CadastroUsuario extends React.Component {
    constructor(){
        super();
        this.usuarioService = new UsuarioService();
    }

    state = {
        nome: '',
        email: '',
        senha: '',
        senhaRepeticao: ''
    }

    validar= () => {
        const {nome, email, senha, senhaRepeticao} = this.state
        const usuario = {nome, email, senha, senhaRepeticao}

        try{
            this.usuarioService.validar(usuario);
        }catch(error){
            const msgsErro = error.mensagens;
            msgsErro.forEach(msg => mensagemAlerta(msg));
            return false;
        }    

        this.salvar(usuario);
    }

    salvar = (usuario) => {
        this.usuarioService.salvar(usuario).
            then( response => {
               mensagemSucesso("Usuário cadastrado com sucesso! Faça o login para acessar o sistema");
               this.props.history.push('/login');     
            }).catch(error => {
               mensagemErro(error.response.data);
            });
    }

    prepareLogar = () => {
        this.props.history.push('/login');
    }

    render() {
        return (
            <Card title="Cadastro de usuário">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="bs-component">
                            <fieldset>
                                <FormGroup label="Nome: *" htmlFor="inputNome">
                                    <input type="text"
                                        className="form-control"
                                        id="inputNome"
                                        name="nome"
                                        onChange={(e) => this.setState({ nome: e.target.value })}>
                                    </input>
                                </FormGroup>
                                <FormGroup label="E-mail: *" htmlFor="inputEmail">
                                    <input type="text"
                                        className="form-control"
                                        id="inputEmail"
                                        name="email"
                                        onChange={(e) => this.setState({ email: e.target.value })}>
                                    </input>
                                </FormGroup>
                                <FormGroup label="Senha: *" htmlFor="inputSenha">
                                    <input type="password"
                                        className="form-control"
                                        id="inputSenha"
                                        name="senha"
                                        onChange={(e) => this.setState({ senha: e.target.value })}>
                                    </input>
                                </FormGroup>
                                <FormGroup label="Repita a Senha: *" htmlFor="inputRepitaSenha">
                                    <input type="password"
                                        className="form-control"
                                        id="inputRepitaSenha"
                                        name="senha"
                                        onChange={(e) => this.setState({ senhaRepeticao: e.target.value })}>
                                    </input>
                                </FormGroup>
                                <button onClick={this.validar} 
                                        type="button" 
                                        className="btn btn-success">
                                        <i className="pi pi-save"> </i> Salvar</button>
                                <button onClick={this.prepareLogar} 
                                        type="button" 
                                        className="btn btn-danger">
                                        <i className="pi pi-times"> </i> Cancelar</button>
                            </fieldset>
                        </div>
                    </div>
                </div>
            </Card>
        )
    }
}

export default withRouter( CadastroUsuario )