Foodcloud::Application.routes.draw do
  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)

  devise_for :users
  ActiveAdmin.routes(self)

  resources :token_authentications, :only => [:create, :destroy]

  resources :home do
    collection do
      get 'restaurants'
    end
  end

  namespace :api, :defaults => {:format => :json} do
    namespace :v1 do
      # match 'api/v1/restaurants/menu' => :menu
      resources :restaurants do
        collection do
          get 'menu'
        end
      end
      resources :tokens, :only => [:create, :destroy]
      match 'tokens/create_from_facebook', to: 'tokens#create_from_facebook', via: [:post]
      resources :registration, :only => [:create]
      match 'user/add_address', to: 'user#add_address', via: [:post]
    end
  end
end
