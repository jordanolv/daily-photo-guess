import { Controller, Get, UseGuards, Req, Res, Post, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  @Get('discord')
  @UseGuards(AuthGuard('discord'))
  async discordAuth() {
    // Cette route redirige vers Discord pour l'authentification
  }

  @Get('discord/callback')
  @UseGuards(AuthGuard('discord'))
  async discordAuthCallback(@Req() req: any, @Res() res: Response) {
    // L'utilisateur est authentifié ici, redirigez-le vers le frontend
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/auth/callback?token=${req.user.id}`);
  }

  @Get('status')
  async getStatus(@Req() req: any) {
    console.log(req.user);
    if (!req.user) {
      return { authenticated: false };
    }
    return {
      authenticated: true,
      user: {
        id: req.user.id,
        username: req.user.username,
        avatar: req.user.avatar
      }
    };
  }

  @Post('logout')
  async logout(@Req() req: any, @Res() res: Response) {
    req.logout((err: any) => {
      if (err) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Erreur lors de la déconnexion' });
      }
      res.status(HttpStatus.OK).json({ message: 'Déconnecté avec succès' });
    });
  }
} 