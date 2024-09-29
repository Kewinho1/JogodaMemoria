import tkinter as tk
import random
from tkinter import messagebox

# Definindo a janela principal
root = tk.Tk()
root.title("Jogo da Memória")

# Definindo os parâmetros do jogo
ROWS, COLS = 4, 4  # Número de linhas e colunas do tabuleiro
TILE_SIZE = 8  # Tamanho dos números nas cartas

# Gerando uma lista de pares de números
cards = list(range(1, (ROWS * COLS) // 2 + 1)) * 2
random.shuffle(cards)

# Criando uma matriz para armazenar o estado das cartas (oculta ou revelada)
revealed = [[False] * COLS for _ in range(ROWS)]

# Variáveis de controle
first_card = None  # Armazena a primeira carta virada
buttons = []  # Armazena os botões do jogo

# Função para verificar se o jogador venceu o jogo
def check_win():
    if all(all(row) for row in revealed):  # Verifica se todas as cartas estão reveladas
        messagebox.showinfo("Parabéns!", "Você Não é Burro!")  # Exibe a mensagem de vitória
        root.quit()  # Fecha o jogo após a mensagem

# Função chamada quando uma carta é clicada
def on_click(r, c):
    global first_card

    if revealed[r][c]:  # Se a carta já estiver revelada, ignorar o clique
        return
    
    buttons[r][c].config(text=str(cards[r * COLS + c]), state="disabled")  # Mostra o número
    revealed[r][c] = True

    if first_card is None:
        first_card = (r, c)  # Armazena a primeira carta virada
    else:
        r1, c1 = first_card
        if cards[r1 * COLS + c1] == cards[r * COLS + c]:  # Se forem iguais, manter reveladas
            first_card = None
            check_win()  # Verifica se o jogador venceu após encontrar um par
        else:
            root.after(1000, hide_cards, r1, c1, r, c)  # Se forem diferentes, escondê-las após 1 segundo
            first_card = None

# Função para esconder as cartas se não forem correspondentes
def hide_cards(r1, c1, r2, c2):
    buttons[r1][c1].config(text="", state="normal")  # Esconde a primeira carta
    buttons[r2][c2].config(text="", state="normal")  # Esconde a segunda carta
    revealed[r1][c1] = False
    revealed[r2][c2] = False

# Criando os botões das cartas
for r in range(ROWS):
    row = []
    for c in range(COLS):
        button = tk.Button(root, text="", width=TILE_SIZE, height=TILE_SIZE, 
                           command=lambda r=r, c=c: on_click(r, c))
        button.grid(row=r, column=c)
        row.append(button)
    buttons.append(row)

root.mainloop()
