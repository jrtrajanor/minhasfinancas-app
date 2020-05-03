import ApiService from '../apiService'
import ErroValidacao from '../exception/erroValidacao'

class UsuarioService extends ApiService{
    
    constructor(){
        super('/api/usuarios');
    }

    autenticar(credenciais){
        return this.post('/autenticar', credenciais);
    }

    obterSaldoPorUsuario(id){
        return this.get(`/${id}/saldo`);
    }

    salvar(usuario){
        return this.post('/', usuario);
    }

    validar(usuario){
        const erros = [];

        if (!usuario.nome){
            erros.push("O campo nome é obrigatório.");
        }

        if (!usuario.email){
            erros.push("O campo e-mail é obrigatório.");
        }else if ( !usuario.email.match(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+).(\.[a-z]{2,3})$/) &&
                   !usuario.email.match(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)$/)){
            erros.push("Informe um e-mail válido.");
        }

        if (!usuario.senha || !usuario.senhaRepeticao){
            erros.push("Infome a senha duas vezes para validação.");
        }else if(usuario.senha !== usuario.senhaRepeticao){
            erros.push("As senhas não estão iguais.");
        }

       if (erros && erros.length > 0){
            throw new ErroValidacao(erros);
       }
    }
}

export default UsuarioService;