import { useState } from "react";
import { executeRequest } from "../services/api";
import { NextPage } from "next";
import { AccessTokenProps } from "../types/AccessTokenProps";

/* eslint-disable @next/next/no-img-element */
export const Register: NextPage<AccessTokenProps> = ({
    setToken
}) => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setLoading] = useState(false);

    const doRegister = async () => {
        try {
            setLoading(true);
            setError('');
            if (!name && !email && !password && !confirmPassword) {
                setError('Favor preencher todos os campos');
                setLoading(false);
                return;
            }

            if(password !== confirmPassword){
                setError('Senhas não conferem, tente novamente');
                setLoading(false);
                return;
            }

            const body = {
                name,
                email,
                password
            }

            const result = await executeRequest('user', 'POST', body);

            if (result && result.data) {
                localStorage.setItem('accessToken', result.data.token);
                localStorage.setItem('userName', result.data.name);
                localStorage.setItem('userMail', result.data.email);
                setToken(result.data.token);
            } else {
                setError('Não foi possivel processar o cadastro, tente novamente');
            }
        } catch (e: any) {
            console.log(e);
            if (e?.response?.data?.error) {
                setError(e?.response?.data?.error);
            } else {
                setError('Não foi possivel processar o cadastro, tente novamente');
            }
        }

        setLoading(false);
    }

    return (
        <div className="container-login register">
            <img src="/logo.svg" alt="Logo Fiap" className="logo" />
            <form>
                <p className="error">{error}</p>
                <div className="input">
                    <img src="/user.svg" alt="Informe seu nome" />
                    <input type="text" placeholder="Informe seu nome"
                        value={name} onChange={evento => setName(evento.target.value)} />
                </div>
                <div className="input">
                    <img src="/mail.svg" alt="Informe seu email" />
                    <input type="text" placeholder="Informe seu email"
                        value={email} onChange={evento => setEmail(evento.target.value)} />
                </div>
                <div className="input">
                    <img src="/lock.svg" alt="Informe sua senha" />
                    <input type="password" placeholder="Informe sua senha"
                        value={password} onChange={evento => setPassword(evento.target.value)} />
                </div>
                <div className="input">
                    <img src="/lock.svg" alt="Confirme sua senha" />
                    <input type="password" placeholder="Confirme sua senha"
                        value={confirmPassword} onChange={evento => setConfirmPassword(evento.target.value)} />
                </div>
                <button type="button" onClick={doRegister} disabled={isLoading}
                    className={isLoading ? 'loading' : ''}>
                    {isLoading ? '...Carregando' : 'Registre-se'}
                </button>

                <div className="new-user">
                    Já possui cadastro?
                    <span><a href="/"> Faça seu login</a></span>
                </div>
            </form>
        </div>
    )
}