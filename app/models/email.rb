class Email < ActionMailer::Base
  default :from => "help@dishgo.io"
  def help params, current_user
    @message = params[:user_message]
    @from = current_user.email
    @time = DateTime.now
    @location = params[:location]
    viewmodel = params[:viewmodel]
    console = params[:console]
    @user_agent = params[:user_agent]
    attachments["viewmodel.json"] = viewmodel
    attachments["console.txt"] = console
    mail(:to => "phil@dishgo.io", :from => @from, :subject => "Dishgo Help").deliver
    mail(:to => "tim@dishgo.io", :from => @from, :subject => "Dishgo Help").deliver
  end

  def send_tim_an_email text
    @text = text
    mail(:to => "phil@dishgo.io", :subject => "New Restaurant", template_name: 'send_tim_an_email').deliver
    mail(:to => "tim@dishgo.io", :subject => "New Restaurant", template_name: 'send_tim_an_email').deliver
  end  

  def welcome user
    mail(:to => user.email, :subject => "Welcome to DishGo!").deliver  
    notify_admins user
  end

  def verify_from_app user
    @user = user
    mail(:to => user.email, :subject => "Welcome to DishGo!").deliver  
    # notify_admins user
  end

  def verify_from_network user
    @user = user
    mail(:to => user.email, :subject => "Welcome to DishGo!").deliver  
    notify_admins user, "New Network User"
  end   

  def sign_up_link user
    @link = user.sign_up_link
    mail(:to => user.email, :subject => "Welcome to DishGo!").deliver  
  end  

  def notify_admins user, message = "New App User"
    @user = user
    mail(:to => "phil@dishgo.io", :subject => message, template_name: 'notify_admins').deliver
    mail(:to => "tim@dishgo.io", :subject => message, template_name: 'notify_admins').deliver
  end
end
