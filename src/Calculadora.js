import React from 'react';

class Calculadora extends React.Component{
  
  state = {
    numero1: null,
    numero2: null,
    resultado: null
  }

  somar = () => {
    const soma = parseInt(this.state.numero1) + parseInt(this.state.numero2)
    this.setState({resultado: soma});
  }

  //Exemplo de chama Post sincrona
  entrar = () => {
    axios.post('http://localhost:8080/api/usuarios/autenticar', 
               {
                   email: this.state.email,
                   senha: this.state.senha
               }
    ).then (response => {
        this.props.history.push('/home');            
    }).catch(erro => {
        this.setState({mensagemErro: erro.response.data});
        console.log(erro.response)
    });
}


//Exemplo de chama Post assincrona
entrarAsync = async() => {
    try{
        const response = await axios
            .post('http://localhost:8080/api/usuarios/autenticar', {
                email: this.state.email,
                senha: this.state.senha
            });
        localStorage.setItem('_usuario_logado', JSON.stringify(response.data));    
        this.props.history.push('/home');
    }catch(erro){
        this.setState({mensagemErro: erro.response.data});
    }
}

  render(){
    return(
      <div>
        <label>Primeiro valor:</label>
        <input type="text" value={this.state.numero1} onChange={(e) => this.setState({numero1: e.target.value})}>
           </input>
        <br />
        <label>Segundo valor:</label>
        <input type="text" value={this.state.numero2} onChange={(e) => this.setState({numero2: e.target.value})}>
           </input>       
        <br />

        <button onClick={() => this.setState({resultado: parseInt(this.state.numero1) + parseInt(this.state.numero2)})}>
          Somar</button>
        <br />
        <button onClick={this.somar}>
          Somar com função</button>
        <br />
        this.state.Resultado é:  {parseInt(this.state.numero1) + parseInt(this.state.numero2)}
        <br />
        this.state.Resultado é:  {this.state.resultado}
      </div>
    )
  }
}

export default Calculadora;
