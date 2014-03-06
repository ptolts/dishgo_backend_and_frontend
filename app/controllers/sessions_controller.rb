class SessionsController < Devise::SessionsController
  def create
    @user = User.find_by_email(params[:user][:email])
    if !@user or @user.confirmed?
      super
    else
		redirect_to :controller => 'registration', :action => 'confirm'
    end
  end 
end