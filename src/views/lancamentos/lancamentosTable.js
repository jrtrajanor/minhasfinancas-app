import React from 'react'
import formatter from 'currency-formatter'

export default props => {

    const rows = props.lancamentos.map(lancamentos => {
        return(
            <tr key={lancamentos.id}>
                <td>{lancamentos.descricao}</td>
                <td>{formatter.format(lancamentos.valor, {locale: 'pt-BR'}) }</td>
                <td>{lancamentos.tipo}</td>
                <td>{lancamentos.mes}</td>
                <td>{lancamentos.status}</td>
                <td>
                    <button className="btn btn-primary" 
                            title="Editar"
                            type="button"
                            disabled={ lancamentos.status == 'CANCELADO' }
                            onClick={(e) => props.actionEdit(lancamentos.id)}>
                            <i className="pi pi-pencil"></i>
                    </button>
                    <button type="button" title="Excluir"
                            className="btn btn-danger"
                            onClick={(e) => props.actionDelete(lancamentos)}>
                            <i className="pi pi-trash"></i>
                    </button>
                    <button type="button" title="Efetivar"
                            className="btn btn-warning"
                            disabled={ lancamentos.status == 'CANCELADO' || lancamentos.status == 'EFETIVADO' }
                            onClick={(e) => props.alterarStatus(lancamentos, 'EFETIVADO')}>
                            <i className="pi pi-check"></i>    
                    </button>
                    <button type="button" title="Cancelar"
                            className="btn btn-primary"
                            disabled={ lancamentos.status == 'CANCELADO' }
                            onClick={(e) => props.alterarStatus(lancamentos, 'CANCELADO')}>
                            <i className="pi pi-times"></i>
                    </button>
                </td>
            </tr>    
        )
    });

    return (
        <table className="table table-hover">
            <thead>
                <tr>
                    <th scope="col">Descrição</th>
                    <th scope="col">Valor</th>
                    <th scope="col">Tipo</th>
                    <th scope="col">Mês</th>
                    <th scope="col">Situação</th>
                    <th scope="col">Ações</th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>
    )
}