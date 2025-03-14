import {AppDataSource} from "../sql-data-source";
import {OAuthTokens} from "../entity/OauthTokens";

export class OAuthTokenService {
    oauthTokensRepository = AppDataSource.getRepository(OAuthTokens);

    async updateTokens(tokenInfo: any){
        let existingToken = await this.oauthTokensRepository.findOne({ where: { googleId : tokenInfo.googleId } });
        if (existingToken) {
            // Update existing tokens
            existingToken.accessToken = tokenInfo.accessToken;
            existingToken.refreshToken = tokenInfo.refreshToken;
            existingToken.accessTokenExpiry = tokenInfo.accessTokenExpiry;
            await this.oauthTokensRepository.save(existingToken);
            return existingToken;
        } else {
            // Create new tokens
            const oauthTokens = new OAuthTokens();
            oauthTokens.googleId = tokenInfo.googleId;
            oauthTokens.accessToken = tokenInfo.accessToken;
            oauthTokens.refreshToken = tokenInfo.refreshToken;
            oauthTokens.accessTokenExpiry = tokenInfo.accessTokenExpiry;
            await this.oauthTokensRepository.save(oauthTokens);
            return oauthTokens;
        }
    }
}