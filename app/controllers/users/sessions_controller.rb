class SessionsController < Devise::SessionsController
  def create
    @user = User.where(:email => params[:user][:email]).first
    if !@user or @user.confirmed?
      super
    else
		redirect_to :controller => 'registration', :action => 'confirm'
    end
  end 
end