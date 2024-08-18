export ZSH=$HOME/.oh-my-zsh

plugins=(git pip)

source $ZSH/oh-my-zsh.sh

# Fuzzy search
[ -f ~/.fzf.zsh ] && source ~/.fzf.zsh

# load zgenom
source "${HOME}/.zgenom/zgenom.zsh"

# Update every 3 days
zgenom autoupdate 3

# if the init script doesn't exist
if ! zgenom saved; then

  # Fish-like autosuggestions for zsh
  zgenom load zsh-users/zsh-history-substring-search
  # Includes syntax highlighting
  zgenom load zsh-users/zsh-syntax-highlighting
  #Zsh Completions
  zgenom load zsh-users/zsh-completions
  # Enhancd
  zgenom load b4b4r07/enhancd
  # Auto-pair
  zgenom load hlissner/zsh-autopair
  # autosuggestions should be loaded last
  zgenom load tarruda/zsh-autosuggestions

  # generate the init script from plugins above
  zgenom save
fi


export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

eval "$(oh-my-posh init zsh)"
