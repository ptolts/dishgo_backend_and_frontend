class TopFiveController < ApplicationController
  layout 'network'
  
  def index
    @top_fives = TopFive.where(user_id:current_user.id).collect{|e| e.serializable_hash({export_localized:true})}
    render 'index'
  end

  def create
    @top_five = TopFive.where(id:params[:id]).first || nil
    render 'create'
  end

  def top
    @top_five = TopFive.where(beautiful_url:params[:id]).first || TopFive.find(params[:id])
    render 'top'
  end

  def save
    data = JSON.parse(params[:data])
    if data["id"].blank? or !top_five = TopFive.find(data["id"])
      top_five = TopFive.new
    end
    if !top_five
      render json: {error:true}.as_json
      return
    end

    top_five.name_translations = data["name"]
    top_five.description_translations = data["description"]
    top_five.dish_ids = data["dishes"]
    top_five.user = current_user
    top_five.save!

    render json: {success:true,id:top_five.id}.as_json
  end

end
