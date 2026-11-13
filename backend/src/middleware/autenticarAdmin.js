
import jwt from 'jsonwebtoken';

export default function autenticarAdmin(req, res, next) {
    const autorizacao = req.headers.authorization;

    if (!autorizacao || !autorizacao.startsWith('Bearer ')) {
        return res.status(401).send({
            mensagem: 'Acesso não autorizado.'
        });
    }

    try {
        const token = autorizacao.split(' ')[1];

        const usuario = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        if (usuario.tipo !== 'admin') {
            return res.status(403).send({
                mensagem: 'Acesso exclusivo para administradores.'
            });
        }

        req.usuario = usuario;

        next();
    } catch {
        return res.status(401).send({
            mensagem: 'Token inválido ou expirado.'
        });
    }
}
