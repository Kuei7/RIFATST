import React from 'react';

export function Footer() {
  return (
    <footer className="bg-card py-6 mt-auto">
      <div className="container mx-auto text-center text-muted-foreground">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Viva Sorte. Todos os direitos reservados.
        </p>
        <p className="text-xs mt-2">
          Jogo responsável. Maiores de 18 anos.
        </p>
      </div>
    </footer>
  );
}
